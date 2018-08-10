import Web3 from 'web3'


export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
  return new Web3('http://localhost:8545')
}

export let web3
export let DataVault
export const addressDataVault = '0x8f9a56608cda083f063c1c7de2cdf3d2e8789885'



export function injectWeb3() {
  web3 = getWeb3()
  
	DataVault = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/tool-dappdeployer-node/samples/sample-datavault-react/src/ABI/DataVault.json').abi,
		addressDataVault)

}

