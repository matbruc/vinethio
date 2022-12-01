// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/openzeppelin-contracts/access/AccessControl.sol";

contract CustomerRole is AccessControl {

    bytes32 public constant CUSTOMER_ROLE = keccak256("CUSTOMER_ROLE");
    
    constructor(address customerAddress) public {
        _setupRole(CUSTOMER_ROLE, msg.sender);
        _setupRole(CUSTOMER_ROLE, customerAddress);
    }

    modifier onlyCustomer() {
        require(hasRole(CUSTOMER_ROLE, msg.sender), "Caller is not a Customer");
        _;
    }

}