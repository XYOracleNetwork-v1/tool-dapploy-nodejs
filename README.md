## XYO Dapp Deployer

Automate deployment of Dapps to your React App locally and/or to your remote server via AWS S3

# Prerequisits:  

You will need an ethereum node fully synced, and an ethereum account that has enough ETH to cover cost of gas for deploying contracts.

# Use geth to sync a node:

Install geth with `brew install geth`

Sync with Ropsten testnet using:
`geth --rpc --rpcapi="personal,eth,network,net,web3" --testnet`

This will take over 2 hours to fully sync. You have to sync the node from where you left off each time you want to deploy

# Create ethereum account to deploy contracts:

Use metamask, mycrypto.io or your preferred wallet provider.  This account is responsible for deploying the contracts and must have enough ETH to pay for the gas.

# Import the account on your node
Place your private key into a keyfile "ropsten", and import the account. It will ask you for a password to protect the imported keyfile.  You only have to do this once.

`geth --datadir ~/Library/Ethereum/testnet account import ./keys/ropsten`

Restart ropsten with option to unlock account. Your password is required.

`geth --rpc --rpcapi="personal,eth,network,net,web3" --datadir ~/Library/Ethereum/testnet --unlock 0x3d70f5f9b66311bbbd497471d9a69f476ea1d70b --testnet`

# Configure Dapp Deployer

* Set the `network` in `deployer.conf` to one of the following:
ropsten, kovan, development, ropsten-infura, main

* Add the truffle project root path for `projectDir`

* If you are building a react app, or javascript compatable web3 complient, add the local path to copy your ABI in `contractOutput`.  
* Optionally include the destination to export the web3 provider module: `web3ModuleOutput`

* If you want to upload your ABI to Amazon S3, include AWS section with bucketName, access, and secret key.

* Run ./contractDeployer.js




Verify the account has ETH in it. Do this after the state completely syncs. Ie you no longer see `Imported new state entries` in getch output




