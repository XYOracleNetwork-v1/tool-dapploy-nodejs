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

    event IPFSStored(string vault, uint indexed vaultId, address indexed owner);

    function stringToUint(string s) 
        internal 
        pure 
        returns (uint) 
    {
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
      string _vault,
      string _ipfsHash
    )
        public
    {
        require(bytes(_vault).length < 32, "Vault name must be less than 32 bytes");
        uint vaultId = stringToUint(_vault);
        if (!exists(vaultId)) {
            _mint(msg.sender, vaultId);
        }
        require (ownerOf(vaultId) == msg.sender, "Sender must own Vault");
        _setTokenURI(vaultId, _ipfsHash);
        emit IPFSStored(_vault, vaultId, msg.sender);
    }

    /* 
        Returns vault given the string
    */
    function getVault(
        string _vault
    )
        public
        view
        returns (string)
    {
        require(bytes(_vault).length < 32, "Vault name must be less than 32 bytes");
        uint vaultId = stringToUint(_vault);
        return tokenURIs[vaultId];
    }
}