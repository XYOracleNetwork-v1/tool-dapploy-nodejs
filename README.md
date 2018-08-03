## Dapp Deployer

Automate deployment of Dapps!  We've gone through the hoops of Dapp Deployment and automated out a bunch of the pain points.

# Prerequisits:  

We use [Truffle](https://truffleframework.com) to deploy smart contracts on the Ethereum blockchain.  Make sure that's installed globally:
`npm install -g truffle`

Remember to 'YARN ALL THE THINGS' from the main project dir
`yarn && cd examples/react-client/ && yarn && cd ../truffle-project && yarn && cd ../..`

When you run the Dapp Deployer, your truffle project will need to be configured seperately.  A good example you can use is in the example  Truffle project  `examples/truffle-project` and open `truffle.js` config file.

# Create ethereum account to deploy contracts:

You will need an ethereum account (a wallet) with some eth to deploy contracts to your Ethereum network.  You can use metamask, mycrypto.io, Ganache, Geth, Parity, etc, depending on your target ethereum network to create/view your wallet contents.

# Local Setup (Ganache + Metamask)

* [Download](https://github.com/trufflesuite/ganache/releases) latest appropriate Ganache client

* [Download](https://metamask.io/) metamask chrome extension

* Start Ganache, check `Preferences...` menu that port is set to 8545. Sign into Metamask and change Network on Metamask to localhost 8545 

* Copy a private key from one account in your Ganache UI. (Tap on the key symbol `Show Keys` by an account to see the private key)

* Configure dapp deployer per instructions below with network `development`

* Run dapp deployer, skipping aws:
`./contractDeployer.js -s`

# Ropsten Setup (Geth)

* Install geth with 
`brew install geth`

* Sync with Ropsten testnet using:
`geth --rpc --rpcapi="personal,eth,network,net,web3" --testnet`

This will take over 2 hours to fully sync. Wait until you no longer see `Imported new state entries` in geth output.  You have to sync the node from where you left off each time you want to deploy for each network.

* Import your Ropsten account

`geth --datadir ~/Library/Ethereum/testnet account import ./keys/ropsten`

It will ask you for a password to protect the imported keyfile.  You only have to do this once.

* Restart ropsten with option to unlock account. Your password is required.

`geth --rpc --rpcapi="personal,eth,network,net,web3" --datadir ~/Library/Ethereum/testnet --unlock 0x3d70f5f9b66311bbbd497471d9a69f476ea1d70b --testnet`

# Kovan setup (Parity)

Kovan chain only works with parity.  

* Add parity tap: 
`brew tap paritytech/paritytech`

* Install parity with 
`brew install parity`

* Sync with kovan chain
`parity --chain=kovan`

* You will need to move the geth keystore file, or export the metamask keystore file and move to:

`~/Library/Application Support/io.parity.ethereum/keys/kovan`

It will look like:
`UTC--2018-07-19T22-21-46.544691752Z--3d70f5f9b66311bbbd497471d9a69f476ea1d70b`

*  Then restart syncing on kovan, and unlock the account

`parity --chain kovan --fast-unlock --unlock "0x3d70f5f9b66311bbbd497471d9a69f476ea1d70b" --password ../password.txt`


# Configure Dapp Deployer

Once you have your network of choice synced, and an account unlocked on the chain, configure and run the Dapp Deployer.

* Set the `network` in `deployer.conf` to one of the following:
ropsten, kovan, development, ropsten-infura, main

* Once you are comfortable compiling and deploying the example projects, set the `projectDir` and `contractOutput` to your own new or existing project

* Optionally include the destination to export the web3 provider module: `web3ModuleOutput`

* Want your dApp to support multiple browsers?  Configure Portis in Dapp deployer setup, by first adding your Dapp on [portis.io](https://portis.io) and adding your key/app name to the configuration file.

* Have a centralized storage server? Copy your ABI to Amazon S3 for your backend to dynamically link in like we do with [Ether Cache](https://github.com/XYOracleNetwork/ether-cache).  Include your AWS S3 `bucketName`, add your access key and add your AWS credentials with approved access to S3 by creating credentials file:
`~/.aws/credentials` with format:

```
[default]
aws_access_key_id = AKIAIFYQ4UEUUJ6GDH6A
aws_secret_access_key = FAKEasdfas=aqewrasdfa/sdfasdfasdfasdfFAKE
```

 [Detailed AWS credential instructions here](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html)






