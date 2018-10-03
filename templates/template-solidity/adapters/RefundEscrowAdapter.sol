pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/payment/RefundEscrow.sol";

/**
 * @title Basic Refund Escrow Contract Adapter
 * @dev Basic implementation of MintableToken with initial supply of 
 */
contract RefundEscrowAdapter is RefundEscrow {

    constructor(address _escrowAccount)
      RefundEscrow(_escrowAccount) 
    public {
    }
}