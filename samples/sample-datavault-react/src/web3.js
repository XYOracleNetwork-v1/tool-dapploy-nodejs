import Web3 from 'web3'
import { PortisProvider } from 'portis'

export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
  return new Web3(new PortisProvider({
                apiKey: '<API_KEY>',
                network: 'development',
                appName: '<APP_NAME>',
                appLogoUrl: '<URL_TO_APP>',
            }))
}
export const contractNamed = (name) => {
  let contractObj = SmartContracts.find(contract => contract.name === name)
  if (contractObj) {
    return contractObj.contract
  }
  return undefined
}

export let SmartContracts = []
export let web3
export let DataVault
export const addressDataVault = '0x2769e1cad45a5989f7cf8b44f85d524ef9e0f199'



export function injectWeb3() {
  web3 = getWeb3()
  
	DataVault = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/tool-dappdeployer-node/samples/sample-datavault-react/src/ABI/DataVault.json').abi,
		addressDataVault)
		SmartContracts.push({name: 'DataVault', contract: DataVault})

}

