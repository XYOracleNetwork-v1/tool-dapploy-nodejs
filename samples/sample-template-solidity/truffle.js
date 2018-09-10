require(`babel-register`)({
  ignore: /node_modules\/(?!openzeppelin-solidity)/
})
require(`babel-polyfill`)
const HDWalletProvider = require(`truffle-hdwallet-provider`)

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
      host: `localhost`,
      port: 8545,
      gas: 6986331
    },
    ropsten: {
      network_id: 3,
      host: `localhost`,
      port: 8545,
      gas: 4700000
    },
    "ropsten-infura": {
      network_id: 3,
      provider: () => new HDWalletProvider(
        `<mnemonic>`,
        `https://ropsten.infura.io/<infura-key>`
      ),
      gas: 4700000
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
