/* eslint-disable */
import HDWalletProvider from "truffle-hdwallet-provider"
import "dotenv/config"
import Web3 from "web3"
import { readLocalABI } from "./ABIReader"
import "babel-polyfill"

const mnemonic = process.env.MNENOMIC
const infuraKey = process.env.INFURA_API_KEY

export class SmartContractService {
  constructor() {
    console.log("Init SmartContractService")
    this.smartContracts = []
    this.currentUser = undefined
    this.refreshContracts.bind(this)
    this.reloadWeb3.bind(this)
    this.refreshUser.bind(this)
  }

  getCurrentNetwork = () => {
    return this.currentNetwork
  }

  getSmartContracts = () => this.smartContracts

  getCurrentConfigStore = () =>
    this.web3
      ? this.web3.currentProvider
        ? this.web3.currentProvider.publicConfigStore
        : undefined
      : undefined

  getNetworksString = networks => {
    let networkString = ""
    let iterator = 0
    Object.entries(networks).forEach(net => {
      networkString += this.getNetworkString(iterator, net[0])
      iterator++
    })
    return networkString
  }

  getNetworkString = (iterator, netId) => {
    let addComma = (iterator, word) => (iterator > 0 ? `, ${word}` : word)
    let word = "localhost"
    switch (netId) {
      case "1":
        word = "mainnet"
        break
      case "3":
        word = "roptsten"
        break
      case "4":
        word = "rinkeby"
        break
      case "42":
        word = "kovan"
        break
      case "5777":
        word = "localhost"
        break
    }
    return addComma(iterator, word)
  }

  contractObject = name =>
    this.smartContracts.find(contract => contract.name === name)

  contractNamed = name => {
    const contractObj = this.contractObject(name)
    return contractObj ? contractObj.contract : undefined
  }

  contractAddress = name => {
    const contractObj = this.contractObject(name)
    return contractObj ? contractObj.address : undefined
  }

  validateContracts = async => {
    return Promise.all(
      this.smartContracts.map(contract => this.validContract(contract.name))
    ).then(results => {
      if (results.length == 0) {
        throw new Error("No contracts found on this network")
      } else {
        return results.reduce((result, next) => result && next)
      }
    })
  }

  validContract = async name => {
    const address = this.contractAddress(name)
    return new Promise((resolve, reject) => {
      this.web3.eth
        .getCode(address)
        .then(
          code =>
            code === "0x0" || code === "0x" ? resolve(false) : resolve(true)
        )
        .catch(err => reject(err))
    })
  }

  getCurrentUser = () => this.currentUser

  refreshContracts = async (netId, dir) => {
    console.log("Refreshing contracts")
    let contracts = []
    return readLocalABI(dir)
      .then(files => {
        return { abi: files }
      })
      .then(data => {
        contracts = data.abi
        this.currentNetwork = this.getNetworkString(0, String(netId))
        let sc = []
        contracts.forEach(contract => {
          let json = contract.data
          if (json && json.networks[netId]) {
            console.log(
              "Adding Contract",
              json.contractName,
              json.networks[netId]
            )
            const address = json.networks[netId].address
            const contract = new this.web3.eth.Contract(json.abi, address)
            sc.push({
              name: json.contractName,
              contract: contract,
              address: address,
              networks: json.networks
            })
          } else if (Object.entries(json.networks).length > 0) {
            console.log(
              "You are on the wrong network",
              this.web3.currentProvider.network,
              Object.entries(json.networks)[0]
            )
            throw new Error("Wrong Network Detected")
          }
        })
        this.smartContracts = sc
        return sc
      })
      .catch(err => {
        console.log("Caught here", err)
        // throw new Error('Could not refresh', err)
      })
  }

  getWeb3 = netId => {
    if (netId !== "5777") {
      return new Web3(
        new HDWalletProvider(
          mnemonic,
          `https://${this.getNetworksString(netId)}.infura.io/v3/${infuraKey}`
        )
      )
    } else {
      var provider = new HDWalletProvider(mnemonic, "http://localhost:8545")
      return new Web3(provider)
    }
  }

  refreshUser = async () =>
    this.web3.eth.getAccounts().then(accounts => {
      console.log(`Updating USER from ${this.currentUser} to ${accounts[0]}`)
      this.currentUser = accounts[0]
      return accounts[0]
    })

  reloadWeb3 = async (netId, dir) => {
    this.web3 = this.getWeb3(netId)
    return this.refreshContracts(netId, dir)
  }
}
