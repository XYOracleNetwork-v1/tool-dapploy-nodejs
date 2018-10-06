pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

/**
 * @title Basic ERC20 Adapter
 * @dev Basic implementation of ERC20 with initial supply
 */
contract ERC20Adapter is MintableToken {
  string public _name;
  string public _symbol;
  uint public _decimals;

  constructor (
    string name, 
    string symbol, 
    uint decimals, 
    uint supply
  )
    public 
  {
    _name = name;
    _symbol = symbol;
    _decimals = decimals;
    mint(msg.sender, supply * (10**decimals));
  }
}