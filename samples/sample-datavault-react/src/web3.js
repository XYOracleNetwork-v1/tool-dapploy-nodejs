import Web3 from 'web3'


export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
  return new Web3('http://localhost:8545')
}

export let web3
export let DataVault
export const addressDataVault = '0x821da2fe0f3307512a58098c64082ace1312ee3f'



export function injectWeb3() {
  web3 = getWeb3()
  
	DataVault = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/example-datavault-react/src/ABI/DataVault.json').abi,
		addressDataVault)

}

