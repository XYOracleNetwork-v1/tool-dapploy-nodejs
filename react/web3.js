import Web3 from 'web3'
import { PortisProvider } from 'portis'

export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
     return new Web3(
        new PortisProvider({
        apiKey: 'apiKey',
        network: 'localhost',
        appName: 'LayerOne',
        appLogoUrl: 'http://www.layerone.co/img/logo-white.png',
        }),
    )
}

export let web3
export let QuadToken
const addressQuadToken = 0xcf9514a47b6703b38d36f49351faa220953669df

export let LRGToken
const addressLRGToken = 0x917b5d757348aee2eda69aca4e843c1400daf2e8

export let LandRushCrowdsale
const addressLandRushCrowdsale = 0x27b9ad84ba5da624ff3dcab301266b6f9349b447



export function injectWeb3() {
  web3 = getWeb3()
  	QuadToken = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/xyo-dapp-deployer/contracts').abi,
		addressQuadToken)
	LRGToken = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/xyo-dapp-deployer/contracts').abi,
		addressLRGToken)
	LandRushCrowdsale = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/xyo-dapp-deployer/contracts').abi,
		addressLandRushCrowdsale)

}

