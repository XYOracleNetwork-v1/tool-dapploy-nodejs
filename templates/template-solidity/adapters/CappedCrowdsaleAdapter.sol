pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";

/**
 * @title Capped Crowdsale contract adapter
 * @dev Basic implementation of Capped Crowdsale 
 */
contract CappedCrowdsaleAdapter is CappedCrowdsale {
    constructor (
      uint cap, 
      uint256 rate, 
      address wallet, 
      ERC20 token
    )
      CappedCrowdsale(cap) 
      Crowdsale(rate, wallet, token)
    public {
    }
}