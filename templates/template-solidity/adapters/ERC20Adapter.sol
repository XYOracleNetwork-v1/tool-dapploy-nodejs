pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

/**
 * @title Basic ERC20 Adapter
 * @dev Basic implementation of ERC20 with initial supply
 */
contract ERC20Adapter is MintableToken {
    string public name;
    string public symbol;
    uint public decimals;

    constructor(string _name, string _symbol, uint _decimals, uint _supply) public {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        mint(msg.sender, _supply * (10**_decimals));
    }
}