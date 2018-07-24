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
const addressQuadToken = 0xe3d0aca35404932e33e071dfd43e58fa33c139aa

export let LRGToken
const addressLRGToken = 0x642588a4f4248df880bb1d01858fe01b6050d351

export let LandRushCrowdsale
const addressLandRushCrowdsale = 0x729cb221efc065c3ebe628ba152b19abab2873c4



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

