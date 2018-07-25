import Web3 from 'web3'
import { PortisProvider } from 'portis'

export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
     return new Web3(
        new PortisProvider({
        apiKey: 'API_KEY',
        network: 'ropsten',
        appName: 'LayerOne',
        appLogoUrl: 'http://www.layerone.co/img/logo-white.png',
        }),
    )
}

export let web3
export let QuadToken
const addressQuadToken = 0x61ba3e92fae96c96a3ea3f907647f049cebec716

export let LRGToken
const addressLRGToken = 0x69619346f14d63566880f2fd32124567b429f2ce

export let LandRushCrowdsale
const addressLandRushCrowdsale = 0xa4b7feddaf1fb85647b28f308060010dc84bf57d



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

