pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

/**
 * @title Basic ERC20 Adapter
 * @dev Basic version of StandardToken, with no allowances.
 */
contract ERC20Adapter is MintableToken {
    string public name;
    string public symbol;
    uint8 public decimals;

    constructor(string _name, string _symbol, uint8 _decimals) public {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        mint(msg.sender, 100000000*10**_decimals);
    }
}