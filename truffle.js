require('babel-register')({
  ignore: /node_modules\/(?!openzeppelin-solidity)/
});
require('babel-polyfill');
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
    kovan: {
      network_id: 42,
      host:'localhost',
      port:8545,
      gas: 6986331,
      from: "0x8EAd0450cE2b7B21F313a3232f83121c768FcA71" // change to unlocked acct 
    },
    ropsten: {
      host: "localhost",
      port: 8545,
      network_id: 3,
      gas: 4700000,
      from: "0x3d70f5f9b66311bbbd497471d9a69f476ea1d70b" // change to unlocked acct 
    },
    'ropsten-infura': {
      provider: () => new HDWalletProvider("<passphrase>", "https://ropsten.infura.io/<key>"),
      network_id: 3,
      gas: 4700000
    },
    main: {
      
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};
