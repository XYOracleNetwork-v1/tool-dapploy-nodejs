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
export let LRGToken
const addressLRGToken = 0x9d851f973636036ebdad1b1ae2a1260437ca3580



export function injectWeb3() {
  web3 = getWeb3()
  
	LRGToken = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/xyo-dapp-deployer/react/ABI/LRGToken.json').abi,
		addressLRGToken)

}

