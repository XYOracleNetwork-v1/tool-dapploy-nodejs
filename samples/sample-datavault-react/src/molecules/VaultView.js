import React from 'react';
import glam, { Div, H4 } from 'glamorous'
import {Seperator} from '../atoms/Seperator'
var bigInt = require("big-integer");

function decodeVaultId(number){
  let remainder = bigInt(number.toString())
  let result = ""
  while (remainder.gt(0)) {
    const char = String.fromCharCode(remainder.and(0xff))
    remainder = remainder.shiftRight(8)
    result = char + result
  }
	return result;
}

const VaultDiv = glam.div({
  display: 'flex',
  alignItems: 'left',
  flexDirection: 'row',
  textAlign: 'left',
  height: 35,
})

const vaultClicked = async ({ipfsHash}) => {
    console.log("VAULT CLICKED")
    // Would be the place to decrypt any encrypted vault
    window.location.assign(`https://gateway.ipfs.io/ipfs/${ipfsHash}`)
  }

  export const VaultView = ({vaults}) => {
    return vaults.map((vault) => {
      // console.log("VAULT", vault)
      return (
      <VaultDiv key={vault.key}>
        <H4> 
          <a 
            href={`https://ipfs.infura.io:5001/api/v0/cat?arg=${vault.ipfsHash}`}
            target="_blank"
          > 
          { decodeVaultId(vault.vault) }
          </a>
          <Div 
            onClick={() => vaultClicked(vault)}
            css={{    
              display:'inline',
              cursor: 'pointer',
            }}> - { vault.vault }
          </Div>
        </H4>
        <Seperator />
      </VaultDiv>
      )
    })
  }