require(`babel-register`)({
  ignore: /node_modules\/(?!openzeppelin-solidity)/
})
require(`babel-polyfill`)
const HDWalletProvider = require(`truffle-hdwallet-provider`)
const mnemonic = `This is a series of 12 words that reflect your private key`
module.exports = {
  migrations_directory: `./migrations`,
  networks: {
    development: {
      network_id: `*`, // Match any network id
      host: `localhost`,
      port: 8545
    },
    kovan: {
      network_id: 42,
      provider: () => new HDWalletProvider(mnemonic, `https://kovan.infura.io/<infura-key>`),
      gas: 6986331
    },
    ropsten: {
      network_id: 3,
      provider: () => new HDWalletProvider(
        mnemonic,
        `https://ropsten.infura.io/<infura-key>`
      ),
      gas: 6986331
    },
    mainnet: {
      network_id: `1`,
      provider: () => new HDWalletProvider(
        `<mnemonic>`,
        `https://mainnet.infura.io/<infura-key>`
      ),
      gas: 4500000,
      gasPrice: 2000000000
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
}
