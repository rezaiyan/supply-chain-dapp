// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping(address => bool) bearer;
    }

    /**
     * @dev Give an account access to this role. Reverts if the account is the zero address or already has the role.
     */
    function add(Role storage role, address account) internal {
        require(account != address(0), "Roles: account is the zero address");
        require(!has(role, account), "Roles: account already has role");

        role.bearer[account] = true;
    }

    /**
     * @dev Remove an account's access to this role. Reverts if the account is the zero address or does not have the role.
     */
    function remove(Role storage role, address account) internal {
        require(account != address(0), "Roles: account is the zero address");
        require(has(role, account), "Roles: account does not have role");

        role.bearer[account] = false;
    }

    /**
     * @dev Check if an account has this role. Reverts if the account is the zero address.
     * @return bool indicating whether the account has the specified role.
     */
    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return role.bearer[account];
    }
}
