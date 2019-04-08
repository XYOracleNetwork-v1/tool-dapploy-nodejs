pragma solidity >=0.5.0 <0.6.0;

import "./payment/escrow/RefundEscrow.sol";

/**
 * @title Basic Refund Escrow Contract Adapter
 * @dev Basic implementation of MintableToken with initial supply of 
 */
contract RefundEscrowAdapter is RefundEscrow {

    constructor ( 
      address escrowAccount
    )
      RefundEscrow(escrowAccount) 
    public {
    }
}