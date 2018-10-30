pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";

/*
    A transferrable Data storage vault that lets you store, transfer, 
    and access information associated to a 32 character string
*/
contract DataVault is ERC721MetadataMintable {
    /*
        Constructs a vault to store files 
    */
    constructor() 
        public 
        ERC721Metadata("Data Vault Local", "DV")
    {
    }

    event DataStored(string vault, uint indexed vaultId, address indexed owner);

    /* 
        Takes a string and converts to binary uint
        This is to be used as the NFT key
        @param str - string to convert to a uint256 integer
    */
    function encodeShortString(string str) 
        public 
        pure 
        returns (uint) 
    {
        require(bytes(str).length < 32, "String must be less than 32 bytes");

        bytes memory b = bytes(str);
        uint number = 0;
        for (uint i = 0; i < b.length; i++) {
            number = number + uint(b[i])*(2**(8*(b.length-(i+1))));
        }
        return number;
    }

    /* 
        Mints a token with associated data and assigns ownership
        @param vault - the Name of the Vault to store
        @param data - the data to put in the vault
    */
    function storeInVault(
        string vault,
        string data
    )
        public
    {
        uint vaultId = encodeShortString(vault);
        if (!exists(vaultId)) {
            _mint(msg.sender, vaultId);
        }
        require (ownerOf(vaultId) == msg.sender, "Sender must own Vault");
        _setTokenURI(vaultId, data);
        emit DataStored(vault, vaultId, msg.sender);
    }

    /* 
        Returns vault contents
        @param vault The vault to inspect
    */
    function getVaultContents(
        string vault
    )
        public
        view
        returns (string)
    {
        uint vaultId = encodeShortString(vault);
        return tokenURIs[vaultId];
    }

    /* 
        Returns vault contents
        @param vaultId The id of the vault to inspect
    */
    function getVaultContentsId(
        uint vaultId
    )
    public view returns (string) {
        return tokenURIs[vaultId];
    }
}