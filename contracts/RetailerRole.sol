// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/openzeppelin-contracts/access/AccessControl.sol";

contract RetailerRole is AccessControl {

    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");

    constructor(address retailerRole) public {
        _setupRole(RETAILER_ROLE, msg.sender);
        _setupRole(RETAILER_ROLE, retailerRole);
    }

    modifier onlyRetailer() {
        require(hasRole(RETAILER_ROLE, msg.sender), "Caller is not a Retailer");
        _;
    }

}