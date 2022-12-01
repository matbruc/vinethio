// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/openzeppelin-contracts/access/AccessControl.sol";

contract DistributorRole is AccessControl {

    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    constructor(address distributorAddress) public {
        _setupRole(DISTRIBUTOR_ROLE, msg.sender);
        _setupRole(DISTRIBUTOR_ROLE, distributorAddress);
    }

    modifier onlyDistributor() {
        require(hasRole(DISTRIBUTOR_ROLE, msg.sender), "Caller is not a Distributor");
        _;
    }

}