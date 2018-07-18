import Web3 from 'web3'
PORTIS_DECLARATION

export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
  PORTIS_PROVIDER
}

export let web3
CONTRACT_DECLARATIONS

export function injectWeb3() {
  web3 = getWeb3()
  CONTRACT_INSTANTIATION
}

