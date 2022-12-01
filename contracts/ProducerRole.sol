// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/openzeppelin-contracts/access/AccessControl.sol";

contract ProducerRole is AccessControl {

    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");

    constructor(address producerAddress) public {
        _setupRole(PRODUCER_ROLE, msg.sender);
        _setupRole(PRODUCER_ROLE, producerAddress);
    }

    modifier onlyProducer() {
        require(hasRole(PRODUCER_ROLE, msg.sender), "Caller is not a Producer");
        _;
    }

}