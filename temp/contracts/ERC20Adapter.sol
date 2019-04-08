pragma solidity >=0.5.0 <0.6.0;

import "./token/ERC20/ERC20Mintable.sol";

/**
 * @title Basic ERC20 Adapter
 * @dev Basic implementation of ERC20 with initial supply
 */
contract ERC20Adapter is ERC20Mintable {
  string public _name;
  string public _symbol;
  uint public _decimals;

  constructor (
    string memory name, 
    string memory symbol, 
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