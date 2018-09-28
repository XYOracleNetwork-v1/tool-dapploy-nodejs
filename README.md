<h1 align="center">
  <img alt="Dapploy" src="http://xyo.network.s3.amazonaws.com/img/dapploy-logo.jpg" width="300">
</h1>
<h3 align="center">
  "Simplify Dapp Deployment"
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
    <a href="https://david-dm.org/xyoraclenetwork/tool-dapploy-nodejs" title="dependencies status"><img src="https://david-dm.org/xyoraclenetwork/tool-dapploy-nodejs/status.svg"/></a>
  <a href="https://david-dm.org/xyoraclenetwork/tool-dapploy-nodejs?type=dev" title="devDependencies status"><img src="https://david-dm.org/xyoraclenetwork/tool-dapploy-nodejs/dev-status.svg"/></a>
  <a href="https://bettercodehub.com/results/XYOracleNetwork/tool-dapploy-nodejs" title="Better Code"><img src="https://bettercodehub.com/edge/badge/XYOracleNetwork/tool-dapploy-nodejs?branch=master"/></a>
</p>

<p align="center">
  Made with ❤️
  <br/>by [XYO](https://xyo.network)
</p>

---

Finally, you can deploy dApps in less than 5 seconds flat WITHOUT even lifting a finger... Guaranteed!

OK, you may have to lift a finger.

But here's the deal.

We've gone through the hoops of deploying dApps on the Ethereum Network and have nuked out all of the annoying parts to make dapployment a breeze.

# Pt. I. Let's Get Crack-a-Lackin'

1. We use [Truffle](https://truffleframework.com) to deploy our smart contracts to any Ethereum blockchain.

**NOTE:** When you run the Dapp Deployer, your truffle project will need to be configured seperately. A good example you can use is in the provided sample Truffle project `samples/sample-datavault-solidity` and open `truffle.js` config file.

2. Remember to 'YARN ALL THE THINGS' from the main project dir. Run this command:

```
yarn && cd samples/sample-datavault-react/ && yarn && cd ../sample-datavault-solidity && yarn && cd ../..
```

3. Run `dapploy -h` to see the options:

```
Usage: dapploy [options] [command]

Options:

  -V, --version                                 output the version number
  -t, --projectDir <dir>                        Truffle Project Directory
  -n, --network [network]                       Deploy to network (default: development)
  -c, --config <config>                         Config file (default: .dapploy)
  -o, --contractOutput <dir>                    Contract Output Directory
  -x, --excludeContracts [Contract1,Contract2]  Exclude contracts from the web3 interface (files are still copied)
  -a, --includeContracts [Contract1,Contract2]  Include contracts from the web3 interface (files are still copied)
  -l, --clean                                   Clean contracts before migrating
  -r, --remoteOnly                              Only copy contracts remote
  -p, --pinToIpfs                               Pin contracts to IPFS for remote access
  -k, --bucketName                              Do remote copy of ABI to aws bucket (make sure to setup ~/.aws)
  -y, --copyOnly                                Only do folder copy and S3 copy
  -i, --init                                    Add default config file to current directory
  -h, --help                                    output usage information

Commands:

  init [options] [dir]                          Configure a new truffle project from scratch
  dapper [options]                              View your smart contracts using dapper

```

# Pt II. This Time, It's Personal

### Now, it's time to create an Ethereum Account (AKA "wallet") to deploy smart contracts!

You will need an Ethereum Account with some ETH to deploy contracts to the Ethereum Network.

You can use metamask, mycrypto.io, Ganache, Geth, Parity, etc.

Let's go through a few of these now!

### Setup Option #1: Local Setup (Ganache + Metamask)

---

1. [Download and install Ganache from their site](https://truffleframework.com/ganache)

- [Install MetaMask from their site](https://metamask.io/)

- K, back to Ganache. Open it up.
- Click the Gear Icon thingy ( ⚙️ ) to open `Preferences...`.
  v Make sure that port is set to 8545.
- Click "Save and Restart" in the top-right of Ganache
- Click the MetaMask fox icon in your chrome browser and complete all the first-timer steps if you're a MetaMask virgin.
- Sign into Metamask and change Network on Metamask to localhost 8545
- Now back to Ganache!
- In your Ganache UI, you'll see a list of ~10 addresses. Click the key icon (🔑) next to one of 'em. And then COPY the "Private Key"
- Head over to the `deployer.conf` file and open it up.
- Make sure that the `network` is set to the following: `network=development`.
- Run dapp deployer, skipping aws:

```
  ./dapploy
```

- Run the react client project to play with your deployed Dapp!

```
cd samples/sample-datavault-react && yarn start
```

### [Setup Option #2: Ropsten Setup (Geth)](https://github.com/XYOracleNetwork/tool-dapploy-nodejs/wiki/Local-Ropsten-Config)

### [Setup Option #3: Kovan setup (Parity)](<https://github.com/XYOracleNetwork/tool-dapploy-nodejs/wiki/Kovan-setup-(Parity)>)

# Some Dapploy Features

- Create a smart contract project from a built in template. The template will install a new dapp into your current working directory configured with a brand new ERC20 Token ready to go!
  Simply run : `./dapploy init`

- You can configure the `network` in `deployer.conf` to any of the following:
  ropsten, kovan, development, mainnet

- Make sure you can compile and deploy the sample projects, then set the `projectDir`, `contractOutput`, and `web3ModuleOutput` to your projects

- Want your dApp to support multiple browsers? Configure Portis in Dapp deployer setup, by first adding your Dapp on [portis.io](https://portis.io) and adding an infura key if needed.

- Have a centralized storage server? Copy your ABI to Amazon S3 for your backend to dynamically link in like we do with [Ether Cache](https://github.com/XYOracleNetwork/ether-cache). Include your AWS S3 `bucketName`, add your access key and add your AWS credentials with approved access to S3 by creating credentials file:
  `~/.aws/credentials` with format:

```
[default]
aws_access_key_id = AKIAIFYQ4UEUUJ6GDH6A
aws_secret_access_key = FAKEasdfas=aqewrasdfa/sdfasdfasdfasdfFAKE
```

[Detailed AWS credential instructions here](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html)

## Street Cred

Made with ❤️
by [XYO](https://xyo.network)
