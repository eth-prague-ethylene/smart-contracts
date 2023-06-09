// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CERC20 is ERC20, ERC165, Ownable {
    // ========================================
    //     EVENT & ERROR DEFINITIONS
    // ========================================

    // ========================================
    //     VARIABLE DEFINITIONS
    // ========================================

    // ========================================
    //    CONSTRUCTOR AND CORE FUNCTIONS
    // ========================================

    constructor () ERC20('Custom ERC20', 'CERC20') {}

    // ========================================
    //     ADMIN FUNCTIONS
    // ========================================

    function mint(address _address, uint256 _amount) external onlyOwner {
        _mint(_address, _amount);
    }

     // ========================================
    //     OTHER FUNCTIONS
    // ========================================

    /**
     * @notice Returns if internface is supported
     * @dev ERC165
     */
    function supportsInterface(bytes4 _interfaceId)
        public
        view
        virtual
        override(ERC165)
        returns (bool)
    {
        return
            ERC165.supportsInterface(_interfaceId);
    }
}
