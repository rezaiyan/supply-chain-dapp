// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Roles.sol";

contract RetailerRole {
    using Roles for Roles.Role;

    // Events
    event RetailerAdded(address indexed account);
    event RetailerRemoved(address indexed account);

    // Struct for retailer roles
    Roles.Role private retailers;

    // Constructor
    constructor() {
        _addRetailer(msg.sender);
    }

    // Modifier
    modifier onlyRetailer() {
        require(isRetailer(msg.sender), "Caller is not a retailer");
        _;
    }

    // Check if an account is a retailer
    function isRetailer(address account) public view returns (bool) {
        return retailers.has(account);
    }

    // Add a retailer role
    function addRetailer(address account) public onlyRetailer {
        _addRetailer(account);
    }

    // Renounce the retailer role
    function renounceRetailer() public {
        _removeRetailer(msg.sender);
    }

    // Internal function to add retailer
    function _addRetailer(address account) internal {
        retailers.add(account);
        emit RetailerAdded(account);
    }

    // Internal function to remove retailer
    function _removeRetailer(address account) internal {
        retailers.remove(account);
        emit RetailerRemoved(account);
    }
}
