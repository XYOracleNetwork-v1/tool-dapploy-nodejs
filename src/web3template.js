/* 
  This is an auto-generated web3 interface to the smart contracts deployed via Dapploy
  Do not make changes to this file, they get overwritten each Dapploy :)
*/

import Web3 from 'web3'
PORTIS_DECLARATION

export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
  PORTIS_PROVIDER
}

const contractObject = (name) => SmartContracts.find(contract => contract.name === name)

export const contractNamed = (name) => {
  const contractObj = contractObject(name)
  return contractObj ? contractObj.contract : undefined
}

export const contractAddress = (name) => {
  const contractObj = contractObject(name)
  return contractObj ? contractObj.address : undefined
}

export const validContract = async (name) => {
  const address = contractAddress(name)
  return web3.eth.getCode(address).then(code => {
    return code === "0x" ? Promise.resolve(false) : Promise.resolve(true)
  })
} 

const refreshCurrentUser = async () => {
  const accounts = await web3.eth.getAccounts()
  if (accounts.length > 0) {
    return accounts[0]
  }
  return undefined
}

export let SmartContracts = []
export let web3
export let currentUser

CONTRACT_DECLARATIONS

export function injectWeb3() {
  web3 = getWeb3()
  
  let refreshUser = () => refreshCurrentUser().then(account => currentUser=account)
  // Will refresh local store when new user is chosen:
  web3.currentProvider.publicConfigStore.on('update', refreshUser);

  CONTRACT_INSTANTIATION
}

