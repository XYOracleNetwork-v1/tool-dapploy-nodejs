pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";

/**
 * @title Capped Crowdsale contract adapter
 * @dev Basic implementation of Capped Crowdsale 
 */
contract CappedCrowdsaleAdapter is CappedCrowdsale {
    constructor(uint _cap, uint256 _rate, address _wallet, ERC20 _token)
      CappedCrowdsale(_cap) 
      Crowdsale(_rate, _wallet, _token)
    public {
    }
}