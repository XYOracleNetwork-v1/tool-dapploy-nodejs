## XYO Dapp Deployer

Automate deployment of Dapps to your Web3 Dapp locally and/or to your remote Caching server via AWS S3.  [See Ether Cache for server portion] (https://github.com/XYOracleNetwork/ether-cache)

# Prerequisits:  

You will need an ethereum node fully synced, or use infura nodes by following below instructions. You'll also need an ethereum account that has enough ETH to cover cost of gas for deploying contracts.

# Create ethereum account to deploy contracts:

Use metamask, mycrypto.io or your preferred wallet provider.  This account is responsible for deploying the contracts and must have enough ETH to pay for the gas.

For the purposes of setup here, place your private key into a keyfile "ropsten", "kovan"

# Ropsten Setup

# Use geth to sync a local  node:

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

# Kovan setup

# Use parity to sync a node
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

* Add the truffle project root path for `projectDir`

* If you are building a javascript compatable web3 client (React, etc), add the local path to copy your ABI in `contractOutput`.

* Optionally include the destination to export the web3 provider module: `web3ModuleOutput`

* Want to copy your ABI to Amazon S3?  Include your AWS S3 `bucketName`, add your access key and add your AWS credentials with approved access to S3 by creating credentials file:
`~/.aws/credentials` with format:

```
[default]
aws_access_key_id = AKIAIFYQ4UEUUJ6GDH6A
aws_secret_access_key = FAKEasdfas=aqewrasdfa/sdfasdfasdfasdfFAKE
```

 [Detailed AWS credential instructions here](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html)

* Run ./contractDeployer.js




