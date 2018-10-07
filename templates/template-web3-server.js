/*
  This is an auto-generated web3 interface to the smart contracts deployed via Dapploy
  Do not make changes to this file, they get overwritten each Dapploy :)
*/
/* eslint-disable */
var HDWalletProvider = require('truffle-hdwallet-provider')
require(`dotenv`).config() // Store environment-specific variable from '.env' to process.env

const mnemonic = process.env.MNENOMIC
const infuraKey = process.env.INFURA_API_KEY

export const getWeb3 = () => {
  return new HDWalletProvider(
    mnemonic,
    `https://kovan.infura.io/v3/${infuraKey}`,
  )
}

const contractObject = name =>
  SmartContracts.find(contract => contract.name === name)

export const contractNamed = name => {
  const contractObj = contractObject(name)
  return contractObj ? contractObj.contract : undefined
}

export const contractAddress = name => {
  const contractObj = contractObject(name)
  return contractObj ? contractObj.address : undefined
}

export const validateContracts = async => {
  return Promise.all(
    SmartContracts.map(contract => validContract(contract.name)),
  ).then(results => {
    return results.reduce((result, next) => result && next)
  })
}

export const validContract = async name => {
  console.log('Validating Contract', name)
  const address = contractAddress(name)
  return new Promise((resolve, reject) => {
    web3.eth
      .getCode(address)
      .then(
        code =>
          code === '0x0' || code === '0x' ? resolve(false) : resolve(true),
      )
      .catch(err => reject(err))
  })
}

const getCurrentUser = async () =>
  web3.eth.getAccounts().then(accounts => accounts[0])

export let SmartContracts = []
export let web3
export let currentUser

CONTRACT_DECLARATIONS

const refreshContracts = async web3 =>
  web3.eth.net.getId().then(netId => {
    SmartContracts = []
    CONTRACT_INSTANTIATION
    return Promise.resolve(SmartContracts)
  })

export function injectWeb3() {
  web3 = getWeb3()

  const refreshUser = () =>
    getCurrentUser().then(account => {
      currentUser = account
    })
  const refreshDapp = async () =>
    Promise.all([refreshUser(), refreshContracts(web3)])

  // Will refresh local store when new user is chosen:
  web3.currentProvider.publicConfigStore.on('update', refreshDapp)

  return refreshDapp()
}
