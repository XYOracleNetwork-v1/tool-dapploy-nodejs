import Web3 from 'web3'
import { PortisProvider } from 'portis'

export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
  return new Web3(new PortisProvider({
            apiKey: '79206f2b809ca849dfd73e487f2b948c',
            network: 'development',
            appName: 'Data Vault',
            appLogoUrl: 'https://www.disneyclips.com/imagesnewb/images/clippeterpan21.gif?raw=true',
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
export const addressDataVault = '0x9e260ee97485a84a23d4c1f5165cfd9f60aa314c'



export function injectWeb3() {
  web3 = getWeb3()
  
	DataVault = new web3.eth.Contract(
		require('/Users/kevin/deploy/tool-dappdeployer-nodejs/samples/sample-datavault-react/src/ABI/DataVault.json').abi,
		addressDataVault)
		SmartContracts.push({name: 'DataVault', contract: DataVault})

}

