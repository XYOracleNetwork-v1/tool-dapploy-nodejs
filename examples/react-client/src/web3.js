import Web3 from 'web3'
import { PortisProvider } from 'portis'

export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
     return new Web3(
        new PortisProvider({
        apiKey: '79206f2b809ca849dfd73e487f2b948c',
        network: 'development',
        appName: 'Data Vault',
        appLogoUrl: 'http://www.layerone.co/img/logo-white.png',
        }),
    )
}

export let web3
export let DataVault
export const addressDataVault = '0x917666e8b967cb555a5b1bf594018b9348b4381b'



export function injectWeb3() {
  web3 = getWeb3()
  
	DataVault = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/xyo-dapp-deployer/examples/react-client/src/ABI/DataVault.json').abi,
		addressDataVault)

}

