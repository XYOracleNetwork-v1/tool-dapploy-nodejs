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
export let DataVault
export const addressDataVault = '0xabce363b2e8498b4bffd65416c43b1a5451f1e0c'



export function injectWeb3() {
  web3 = getWeb3()
  
	DataVault = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/xyo-dapp-deployer/examples/react-client/src/ABI/DataVault.json').abi,
		addressDataVault)

}

