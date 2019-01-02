import React, { Component } from 'react'
import './App.css'
import { Button, Grid, Form } from 'react-bootstrap'
import { Div, Input } from 'glamorous'
import {
  web3, DataVault, injectWeb3, validContract
} from './web3Adapter-client'
import ipfs from './ipfs'
import { Seperator } from './atoms/Seperator'
import { VaultView } from './molecules/VaultView'
import { TransactionReceipt } from './molecules/TransactionReceipt'

const ChangeNetworkDiv = ({ validNetwork }) => {
  if (validNetwork) {
    return null
  }
  return (
    <Div css={{ backgroundColor: `red` }}>
      Invalid Network, Change To Network with contracts deployed
    </Div>
  )
}

class App extends Component {
  componentWillMount () {
    injectWeb3().then(() => {
      this.refreshIPFS()
      return validContract(`DataVault`).then(validNetwork => this.setState({ validNetwork }))
    })

    console.log(`Mounted`)
  }

  state = {
    validNetwork: true,
    ipfsHash: null,
    buffer: ``,
    ethAddress: ``,
    blockNumber: ``,
    transactionHash: ``,
    gasUsed: ``,
    txReceipt: ``,
    vaults: [],
    vaultName: `Satoshe`,
    tokenCount: 0,
    gasPrice: 0
  }

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    if (file) {
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => this.convertToBuffer(reader)
    }
  }

  convertToBuffer = async (reader) => {
    // file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result)
    // set this buffer -using es6 syntax
    this.setState({ buffer })
  }

  getMyBalance = async (beneficiary) => {
    const tokenCount = await DataVault.methods.balanceOf(beneficiary).call()
    const tokens = Number(tokenCount)
    this.setState({ tokenCount: tokens })
    return tokens
  }

  refreshIPFS = async () => {
    console.log(`DV`, DataVault)
    try {
      const accounts = await web3.eth.getAccounts()
      const owner = accounts[0]
      if (!owner) {
        console.log(`No Accounts!`)
        return
      }

      const tokenCount = await this.getMyBalance(owner)
      console.log(`Received token count: `, tokenCount)
      const results = await Promise.all(
        Array(tokenCount)
          .fill()
          .map((x, i) => DataVault.methods.tokenOfOwnerByIndex(owner, i).call())
      )
      const hashes = await Promise.all(
        results.map((vault, index) => {
          console.log(`Fetching Vault:`, vault)
          return DataVault.methods
            .tokenURI(vault)
            .call()
            .then((metadata) => {
              try {
                const { d, e = false } = JSON.parse(metadata)
                return {
                  key: index, encrypted: e, vault, ipfsHash: d
                }
              } catch (err) {
                console.log(
                  `Invalid Metadata, assuming ipfs: `,
                  vault,
                  metadata
                )
                return {
                  key: index,
                  encrypted: false,
                  vault,
                  ipfsHash: metadata
                }
              }
            })
        })
      )

      this.setState({ vaults: hashes })
    } catch (err) {
      console.log(err)
    }
  }

  onSubmit = async (event) => {
    event.preventDefault()
    // bring in user's account address
    const accounts = await web3.eth.getAccounts()
    const currOwner = accounts[0]
    if (!currOwner) {
      return
    }

    // save document to IPFS,return its hash#, and set hash# to state
    // https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err, ipfsHash)
      if (!err) {
        // Protocol for token metadata
        const metadata = {
          d: ipfsHash[0].hash,
          e: false
        }

        DataVault.methods
          .storeInVault(this.state.vaultName, JSON.stringify(metadata))
          .send({ from: currOwner })
          .then((receipt) => {
            const { transactionHash, blockNumber, gasUsed } = receipt
            console.log(` Got Receipt!`, receipt)
            this.setState({
              transactionHash,
              ipfsHash: ipfsHash[0].hash,
              txReceipt: receipt,
              blockNumber,
              gasUsed,
              ethAddress: receipt.ethAddress
            })
          })
          .catch((err) => {
            console.log(`ERROR when saving: `, err)
          })
      }
    })
  }

  handleChangeName = e => this.setState({
    vaultName: e.target.value
  })

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1>Dapp Deployer Example - Tokenize a file on the blockchain</h1>
        </header>

        <hr />
        <Grid>
          <h3> Upload File </h3>
          <ChangeNetworkDiv validNetwork={this.state.validNetwork} />

          <Form onSubmit={this.onSubmit}>
            <input type='file' onChange={this.captureFile} />
            Token Name:
            <Input
              maxLength={32}
              placeholder='Satoshe'
              onChange={this.handleChangeName}
              type='vaultName'
              value={this.state.vaultName}
              css={{
                paddingLeft: 10,
                marginLeft: 10,
                marginRight: 10,
                border: 0,
                boxShadow: `0 0 5px 0 rgba(0, 0, 0, 0.39)`
              }}
            />
            <Button bsStyle='primary' type='submit'>
              Mint Token
            </Button>
          </Form>
          <hr />
          <h3>
            {` `}
My File Tokens (
            {this.state.tokenCount}
)
            {` `}
          </h3>

          <Button onClick={this.refreshIPFS}> Refresh IPFS Tokens </Button>
          <Div
            css={{
              display: `flex`,
              flexDirection: `column`,
              paddingBottom: 30,
              paddingLeft: 30
            }}
          >
            <VaultView vaults={this.state.vaults} />
          </Div>
          <Seperator />
          <TransactionReceipt {...this.state} />
        </Grid>
      </div>
    )
  } // render
} // App
export default App
