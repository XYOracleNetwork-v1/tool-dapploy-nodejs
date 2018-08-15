


<h1 align="center">
  Dapploy
</h1>
<h3 align="center">
  "Simplify Dapp Deployment".
</h3>

<p align="center">
  <a href="https://circleci.com/gh/XYOracleNetwork/tool-dappdeployer-nodejs">
    <img alt="Circle Status" src="https://circleci.com/gh/XYOracleNetwork/tool-dapploy-nodejs.svg?style=shield&circle-token=17875bb2726cc569f5426d27748d6386f2401f5b">
  </a>
  <a href="https://gitter.im/XYOracleNetwork/Dev">
    <img alt="Gitter Chat" src="https://img.shields.io/gitter/room/XYOracleNetwork/Stardust.svg">
  </a>
  <a href="http://commitizen.github.io/cz-cli/">
    <img alt="Commitizen friendly" src="https://img.shields.io/badge/web3-friendly-brightgreen.svg">
    </a>
</p>

<p align="center">
  Made with ❄️
  <br/>by [XYO](https://xyo.network)
</p>

---

Finally, you can deploy dApps in less than 5 seconds flat WITHOUT even lifting a finger... Guaranteed!

OK, you may have to lift a finger.

But here's the deal.

We've gone through the hoops of deploying dApps on the Ethereum Network and have nuked out all of the annoying parts.

> "Take it from me, after you use Dappstrap, you'll never go back to deploying dApps while wearing women's underwear ever again." - Graham McBain


# Pt I. Let's Get Crack-a-Lackin'  

1. We use [Truffle](https://truffleframework.com) to deploy our smart contracts to any Ethereum blockchain.

**NOTE:** When you run the Dapp Deployer, your truffle project will need to be configured seperately.  A good example you can use is in the provided sample Truffle project  `samples/sample-datavault-solidity` and open `truffle.js` config file.

2. Remember to 'YARN ALL THE THINGS' from the main project dir. Run this command:

```
yarn && cd samples/sample-datavault-react/ && yarn && cd ../sample-datavault-solidity && yarn && cd ../..
```


# Pt II. This Time, It's Personal

### Now, it's time to create an Ethereum Account (AKA "wallet") to deploy smart contracts!

You will need an Ethereum Account with some ETH to deploy contracts to the Ethereum Network.

You can use metamask, mycrypto.io, Ganache, Geth, Parity, etc.

Let's go through a few of these now!

Just make sure your weapon of choice ain't a hook. ARGH!

### Setup Option #1: Local Setup (Ganache + Metamask)
---

1. [Download and install Ganache from their site](https://truffleframework.com/ganache)

* [Install MetaMask from their site](https://metamask.io/)

* K, back to Ganache. Open it up.
* Click the Gear Icon thingy ( ⚙️ ) to open `Preferences...`.
v Make sure that port is set to 8545.
* Click "Save and Restart" in the top-right of Ganache
* Click the MetaMask fox icon in your chrome browser and complete all the first-timer steps if you're a MetaMask virgin (like Arie's mom).
* Sign into Metamask and change Network on Metamask to localhost 8545
* Now back to Ganache!
* In your Ganache UI, you'll see a list of ~10 addresses. Click the key icon (🔑) next to one of 'em. And then COPY the "Private Key"
* Head over to the `deployer.conf` file and open it up.
* Make sure that the `network` is set to the following: `network=development`.
* Run dapp deployer, skipping aws: `./contractDeployer.js -s`
* Run the react client project to play with your deployed Dapp!

`cd samples/sample-datavault-react && yarn start`

### Setup Option #2: Ropsten Setup (Geth)
---

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

### Setup Option #3: Kovan setup (Parity)
---

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


# Pt III. Dapploy!


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

## Street Cred

Made with ❄️  
by [XYO](https://xyo.network)
