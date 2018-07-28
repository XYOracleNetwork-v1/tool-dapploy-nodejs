pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

/*
    A transferrable IPFS storage vault that lets you store 
    and access information on ipfs
*/
contract IPFSVault is ERC721Token {
    /*
        Constructs a vault
    */
    constructor() 
        public 
        ERC721Token("IPFS Token", "IPFST")
    {
    }

    event IPFSStored(string indexed vault, address indexed owner);

    function stringToUint(string s) constant returns (uint) {
        bytes memory b = bytes(s);
        uint result = 0;
        for (uint i = 0; i < b.length; i++) { 
            if (b[i] >= 48 && b[i] <= 57) {
                result = result * 10 + (uint(b[i]) - 48); 
            }
        }
        return result;
    }

    /* 
        Mints a token with the ipfs hash and assigns ownership
    */
    function storeInVault(
      address _beneficiary,
      string _vault,
      string _ipfsHash
    )
        public
    {
        require(bytes(_vault).length < 32);
        uint vaultId = stringToUint(_vault);
        if (!exists(vaultId)) {
            _mint(_beneficiary, vaultId);
        }
        require (ownerOf(vaultId) == msg.sender);
        _setTokenURI(vaultId, _ipfsHash);
        emit IPFSStored(_vault, _beneficiary);
    }
}