import Web3 from 'web3'
import { PortisProvider } from 'portis'

export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
     return new Web3(
        new PortisProvider({
        apiKey: 'API_KEY',
        network: 'kovan',
        appName: 'LayerOne',
        appLogoUrl: 'http://www.layerone.co/img/logo-white.png',
        }),
    )
}

export let web3
export let QuadToken
const addressQuadToken = 0x43daab05c8275c8dd1ca97ad2962c14939855f78

export let LRGToken
const addressLRGToken = 0xd5ed00682784e4f3a489e3b0910926a83330ffea

export let LandRushCrowdsale
const addressLandRushCrowdsale = 0x163efbe39a4dbb9e1fcbb4f04363a19fe17d9977



export function injectWeb3() {
  web3 = getWeb3()
  
	QuadToken = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/xyo-dapp-deployer/contracts/QuadToken.json').abi,
		addressQuadToken)
	LRGToken = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/xyo-dapp-deployer/contracts/LRGToken.json').abi,
		addressLRGToken)
	LandRushCrowdsale = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/xyo-dapp-deployer/contracts/LandRushCrowdsale.json').abi,
		addressLandRushCrowdsale)

}

