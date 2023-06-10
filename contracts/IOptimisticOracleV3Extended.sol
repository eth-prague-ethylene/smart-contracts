// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity ^0.8.16;

import "@uma/core/contracts/optimistic-oracle-v3/interfaces/OptimisticOracleV3Interface.sol";

interface IOptimisticOracleV3Extended is OptimisticOracleV3Interface {
    function disputeAssertion(bytes32 assertionId, address disputer) external;
}
