import Web3 from 'web3'
import { PortisProvider } from 'portis'

export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
     return new Web3(
        new PortisProvider({
        apiKey: 'API_KEY',
        network: 'development',
        appName: 'LayerOne',
        appLogoUrl: 'http://www.layerone.co/img/logo-white.png',
        }),
    )
}

export let web3
export let IPFSVault
const addressIPFSVault = '0xb68d9684c3637b560ef23f7a3fe4a085cc8e6a97'



export function injectWeb3() {
  web3 = getWeb3()
  
	IPFSVault = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/xyo-dapp-deployer/examples/react-client/src/ABI/IPFSVault.json').abi,
		addressIPFSVault)

}

