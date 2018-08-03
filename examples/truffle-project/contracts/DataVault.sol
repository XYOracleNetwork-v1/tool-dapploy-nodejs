pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

/*
    A transferrable Data storage vault that lets you store, transfer, 
    and access information associated to a 32 character string
*/
contract DataVault is ERC721Token {
    /*
        Constructs a vault to store files 
    */
    constructor() 
        public 
        ERC721Token("Data Token", "DT")
    {
    }

    event DataStored(string vault, uint indexed vaultId, address indexed owner);

    /* 
        Takes a string and converts to binary uint
        @param _s - string to convert to a uint256 integer
    */
    function encodeShortString(string _s) 
        public 
        pure 
        returns (uint) 
    {
        require(bytes(_s).length < 32, "String must be less than 32 bytes");

        bytes memory b = bytes(_s);
        uint number = 0;
        for (uint i = 0; i < b.length; i++) {
            number = number + uint(b[i])*(2**(8*(b.length-(i+1))));
        }
        return number;
    }

    /* 
        Mints a token with associated data and assigns ownership
        @param _vault - the Name of the Vault to store
        @param _data - the data to put in the vault
    */
    function storeInVault(
        string _vault,
        string _data
    )
        public
    {
        uint vaultId = encodeShortString(_vault);
        if (!exists(vaultId)) {
            _mint(msg.sender, vaultId);
        }
        require (ownerOf(vaultId) == msg.sender, "Sender must own Vault");
        _setTokenURI(vaultId, _data);
        emit DataStored(_vault, vaultId, msg.sender);
    }

    /* 
        Returns vault contents
        @param _vault The vault to inspect
    */
    function getVaultContents(
        string _vault
    )
        public
        view
        returns (string)
    {
        uint vaultId = encodeShortString(_vault);
        return tokenURIs[vaultId];
    }

    /* 
        Returns vault contents
        @param _vaultId The id of the vault to inspect
    */
    function getVaultContentsId(
        uint _vaultId
    )
    public view returns (string) {
        return tokenURIs[_vaultId];
    }
}