// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity ^0.8.16;

import "@uma/core/contracts/optimistic-oracle-v3/interfaces/OptimisticOracleV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Ethylene is Ownable {
    OptimisticOracleV3Interface private constant _oov3 =
        OptimisticOracleV3Interface(0x382Eb37a27Ee60B9C43Fce24949e383A4718177B); // MUMBAI sandbox
        // OptimisticOracleV3Interface(0x9923D42eF695B5dd9911D05Ac944d4cAca3c4EAB); // GOERLI
    uint64 public defaultLiveness;
    IERC20 public defaultCurrency;
    bytes32 private constant defaultIdentifier = "ASSERT_TRUTH";

    // ========================================
    //     CONSTRUCTOR AND CORE FUNCTIONS
    // ========================================

    /**
     * @notice Constructs the Ethylene contract.
     * @param _currency the currency to use for assertions.
     * @param _liveness the liveness to use for assertions.
     */
    constructor(IERC20 _currency, uint64 _liveness) {
        defaultCurrency = _currency;
        defaultLiveness = _liveness;
    }

    /**
     * @notice Asserts a truth about the world, using a fully custom configuration.
     * @dev The caller must approve this contract to spend at least bond amount of currency.
     * @param claim the truth claim being asserted. This is an assertion about the world, and is verified by disputers.
     * @return assertionId unique identifier for this assertion.
     */
    function assertToOracle(bytes memory claim) public returns (bytes32) {
        bytes32 assertionId = _oov3.assertTruth(
            claim,
            address(this), // asserter
            address(0), // callbackRecipient
            address(0), // escalationManager
            defaultLiveness,
            defaultCurrency,
            _oov3.getMinimumBond(address(defaultCurrency)),
            defaultIdentifier,
            bytes32(0) // domainId
        );

        return assertionId;
    }

    /**
     * @notice Settles the assertion, if it has not been disputed and it has passed the challenge window, and return the result.
     * @param _assertionId the unique identifier for the assertion.
     * @dev This function can only be called once the assertion has been settled, otherwise it reverts.
     * @return result the result of the assertion.
     */
    function settleAndGetAssertionResult(
        bytes32 _assertionId
    ) public returns (bool) {
        return _oov3.settleAndGetAssertionResult(_assertionId);
    }

    // Just return the assertion result. Can only be called once the assertion has been settled.
    /**
     * @notice Returns the result of the assertion.
     * @param _assertionId the unique identifier for the assertion.
     * @dev This function can only be called once the assertion has been settled, otherwise it reverts.
     * @return result the result of the assertion.
     */
    function getAssertionResult(
        bytes32 _assertionId
    ) public view returns (bool) {
        return _oov3.getAssertionResult(_assertionId);
    }

    /**
     * @notice Returns the full assertion object contain all information associated with the assertion.
     * @param _assertionId the unique identifier for the assertion.
     * @dev This function can be called any time, it won't revert if assertion has not been settled.
     * @return assertion the full assertion object.
     */
    function getAssertion(
        bytes32 _assertionId
    ) public view returns (OptimisticOracleV3Interface.Assertion memory) {
        return _oov3.getAssertion(_assertionId);
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
}
