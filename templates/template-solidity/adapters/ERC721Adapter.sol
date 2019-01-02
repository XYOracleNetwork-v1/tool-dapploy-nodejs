pragma solidity ^0.4.25;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol";


/**
 * @title A 721 Token Contract - A non-fungible token contract
 * @dev Basic version of ERC721Token.
 */
contract ERC721Adapter is ERC721Metadata {

    /* 
      Construct a ERC721 with a name and symbol
    */
    constructor
    (
        string name,
        string symbol
    ) 
        ERC721Metadata(name, symbol)
        public 
    {
      // TODO Customize your 721 construction
    }

    /* 
      Let's at least allow some minting of tokens!
      @param beneficiary - who should receive it
      @param tokenId - the id of the 721 token
    */
    function mint
    (
        address beneficiary,
        uint tokenId
    ) 
        public 
    {
        _mint(beneficiary, tokenId);
    }
}