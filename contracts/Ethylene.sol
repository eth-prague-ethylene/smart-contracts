// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity ^0.8.16;

import "@uma/core/contracts/optimistic-oracle-v3/interfaces/OptimisticOracleV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Ethylene is Ownable {
    OptimisticOracleV3Interface private immutable _oov3;
    uint64 public defaultLiveness;
    IERC20 public defaultCurrency;
    bytes32 private constant _defaultIdentifier = "ASSERT_TRUTH";

    mapping(bytes => bytes32) private _assertionIdByLensPostId;

    // ========================================
    //     CONSTRUCTOR AND CORE FUNCTIONS
    // ========================================

    /**
     * @notice Constructs the Ethylene contract.
     * @param _currency the currency to use for assertions.
     * @param _liveness the liveness to use for assertions.
     * @param __oov3 the address of the OptimisticOracleV3 contract.
     */
    constructor(IERC20 _currency, uint64 _liveness, address __oov3) {
        defaultCurrency = _currency;
        defaultLiveness = _liveness;
        _oov3 = OptimisticOracleV3Interface(__oov3);
    }

    /**
     * @notice Asserts a truth about the world, using a fully custom configuration.
     * @dev The caller must approve this contract to spend at least bond amount of currency.
     * @param _claim the truth claim being asserted. This is an assertion about the world, and is verified by disputers.
     * @param _lensPostId the lens post id that the claim is being asserted about.
     */
    function assertToOracle(
        bytes calldata _claim,
        bytes calldata _lensPostId
    ) public {
        bytes32 assertionId = _oov3.assertTruth(
            createFinalClaimAssembly(_claim, _lensPostId),
            address(this), // asserter
            address(0), // callbackRecipient
            address(0), // escalationManager
            defaultLiveness,
            defaultCurrency,
            _oov3.getMinimumBond(address(defaultCurrency)),
            _defaultIdentifier,
            bytes32(0) // domainId
        );

        _assertionIdByLensPostId[_lensPostId] = assertionId;
    }

    /**
     * @notice Settles the assertion, if it has not been disputed and it has passed the challenge window, and return the result.
     * @param _lensPostId the lens post id that the claim is being asserted about.
     * @dev This function can only be called once the assertion has been settled, otherwise it reverts.
     */
    function settleAssertion(bytes calldata _lensPostId) external {
        _oov3.settleAssertion(getAssertionIdByLensPostId(_lensPostId));
    }

    /**
     * @notice Returns the result of the assertion.
     * @param _lensPostId the lens post id that the claim is being asserted about.
     * @dev This function can only be called once the assertion has been settled, otherwise it reverts.
     * @return result the result of the assertion (true/false).
     */
    function getAssertionResult(
        bytes calldata _lensPostId
    ) public view returns (bool) {
        return
            _oov3.getAssertionResult(getAssertionIdByLensPostId(_lensPostId));
    }

    /**
     * @notice Returns the full assertion object contain all information associated with the assertion.
     * @param _lensPostId the lens post id that the claim is being asserted about.
     * @dev This function can be called any time, it won't revert if assertion has not been settled.
     * @return assertion the full assertion object.
     */
    function getAssertionData(
        bytes calldata _lensPostId
    ) public view returns (OptimisticOracleV3Interface.Assertion memory) {
        return _oov3.getAssertion(getAssertionIdByLensPostId(_lensPostId));
    }

    /**
     * @notice Returns the assertion id for a given lens post id.
     * @param _lensPostId the lens post id that the claim is being asserted about.
     * @return assertionId the id of the assertion.
     */
    function getAssertionIdByLensPostId(
        bytes calldata _lensPostId
    ) public view returns (bytes32) {
        return _assertionIdByLensPostId[_lensPostId];
    }

    // ========================================
    //     ADMIN FUNCTIONS
    // ========================================

    /**
     * @notice Sets the default currency used for assertions.
     * @dev This is used in the assertTruth function to default the currency if it is not specified.
     * @param _currency the currency to use for assertions.
     */
    function setDefaultCurrency(IERC20 _currency) external onlyOwner {
        defaultCurrency = _currency;
    }

    /**
     * @notice Sets the default liveness used for assertions.
     * @dev This is used in the assertTruth function to default the liveness if it is not specified.
     * @param _liveness the liveness to use for assertions.
     */
    function setDefaultLiveness(uint64 _liveness) external onlyOwner {
        defaultLiveness = _liveness;
    }

    // ========================================
    //     HELPER FUNCTIONS
    // ========================================

    function createFinalClaimAssembly(
        bytes memory claim,
        bytes memory lensPostId
    ) private pure returns (bytes memory) {
        bytes memory mergedBytes = new bytes(claim.length + lensPostId.length);

        assembly {
            let length1 := mload(claim)
            let length2 := mload(lensPostId)
            let dest := add(mergedBytes, 32) // Skip over the length field of the dynamic array

            // Copy claim to mergedBytes
            for {
                let i := 0
            } lt(i, length1) {
                i := add(i, 32)
            } {
                mstore(add(dest, i), mload(add(claim, add(32, i))))
            }

            // Copy lensPostId to mergedBytes
            for {
                let i := 0
            } lt(i, length2) {
                i := add(i, 32)
            } {
                mstore(
                    add(dest, add(length1, i)),
                    mload(add(lensPostId, add(32, i)))
                )
            }

            mstore(mergedBytes, add(length1, length2))
        }

        return mergedBytes;
    }
}
