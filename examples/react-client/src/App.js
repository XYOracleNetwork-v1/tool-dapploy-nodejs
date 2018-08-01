import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {web3, IPFSVault, injectWeb3} from './web3';
import ipfs from './ipfs';
import { Button, Grid, Form, Table } from 'react-bootstrap';
import glam, { Div } from 'glamorous'


const IPFSDiv = glam.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'right',
  justifyContent: 'space-around',
  width: 120,
  height: 30,
})

const Seperator = () => {
  return (
    <Div
      css={{
        margin: 10,
        height: 1,
        backgroundColor: '#b7c2bf',
      }}
    />
  )
}

const IPFSRow = ({hash}) => {
  return (
    <IPFSDiv>
      {hash}: <a href={`https://ipfs.infura.io:5001/api/v0/cat?arg=${hash}`}> Contents... </a>
    </IPFSDiv>
  )
}

const IPFSRows = ({ipfsHashes}) => {
  return ipfsHashes.map((hash) => {
    return <IPFSRow hash={hash} />
  })
}

const VaultDiv = glam.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
  width: 120,
  height: 50,
})

const Vaults = ({vaults}) => {
  return vaults.map((vault) => {
    return (
    <VaultDiv>
    <Div>Vault: { vault.vaultName } </Div>
    <IPFSRows vault={vault} />
    </VaultDiv>
    )
  })
}


class App extends Component {

  componentWillMount() {

    injectWeb3()

    console.log("Mounted")
  }

  state = {
    currentVault: 'Test Vault',
    ipfsHash: null,
    buffer: '',
    ethAddress: '',
    blockNumber: '',
    transactionHash: '',
    gasUsed: '',
    txReceipt: '',
    vaults: []
  };

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    if (file) {
      let reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => this.convertToBuffer(reader)
    }
  };

  convertToBuffer = async (reader) => {
    //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    this.setState({ buffer });
  };

  refreshReceipt = async () => {
    try {
      this.setState({ blockNumber: "waiting.." });
      this.setState({ gasUsed: "waiting..." });
      //get Transaction Receipt in console on click
      //See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
      await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt) => {
        if (!err) {
          const event = txReceipt.logs.find(e => e.event === 'IPFSStored')
          console.log("IPFSStored Event: ", event);
          console.log("TXN Receipt", err, txReceipt);
          this.setState({ txReceipt });
          this.setState({ blockNumber: this.state.txReceipt.blockNumber });
          this.setState({ gasUsed: this.state.txReceipt.gasUsed });
        }
        console.log("TXN Error", err);

      }); 

    } 
    catch (error) {
      console.log(error);
    } 
  } 

  getMyBalance = async (beneficiary) => {
    console.log("BENEF", beneficiary, IPFSVault.methods)
    const tokenCount = await IPFSVault.methods.balanceOf(beneficiary).call()
    console.log("count", tokenCount)

    return Number(tokenCount)
  }

  onClickGetIPFSVault = async () => {
    try {
      console.log("HERE")

      const accounts = await web3.eth.getAccounts();
      console.log("Get IPFS Accounts ", accounts)
      const owner = accounts[0]
      if (!owner) {
        console.log("No Accounts!")
        return
      }
  
      const tokenCount = await this.getMyBalance(owner)
      console.log("Received token count: ", tokenCount)
      const results = await Promise.all(
        Array(tokenCount)
          .fill()
          .map((x, i) => IPFSVault.methods.tokenOfOwnerByIndex(owner, i).call()),
      )
      // const vaultResultsresults.map()
      console.log("Received vaults: ", results)
      this.setState({vaults: results})
    } catch (err) {
      console.log(err);
    }
  }
  
  onSubmit = async (event) => {
    event.preventDefault();
    //bring in user's account address
    const accounts = await web3.eth.getAccounts();

    //obtain contract address from web3.js
    const ethAddress = await web3.addressIPFSVault;
    this.setState({ ethAddress });
    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err, ipfsHash);
      //setState by setting ipfsHash to ipfsHash[0].hash 
      this.setState({ ipfsHash: ipfsHash[0].hash });
      console.log('Storing account: ' + accounts[0], this.state.currentVault, ipfsHash[0].hash);

      const { logs } = IPFSVault.methods.storeInVault(accounts[0], this.state.currentVault, ipfsHash[0].hash).send({
        from: accounts[0]
      }, (error, transactionHash) => {
        console.log(" Finished Storing", transactionHash, error);
        this.setState({ transactionHash });
        this.refreshReceipt();
      })

      console.log("Store In Vault Logs: ", logs)
      
    }) 
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1> Ethereum and IPFS with Create React App</h1>
        </header>
          
        <hr />
        <Grid>
          <h3> Choose file to send to IPFS </h3>
          <Form onSubmit={this.onSubmit}>
            <input
              type="file"
              onChange={this.captureFile}
            />
            <Button
              bsStyle="primary"
              type="submit">
              Send it
           </Button>
          </Form>
          <hr />
          <Button onClick={this.onClickGetIPFSVault} > Refresh IPFS Vault </Button>
          <Vaults vaults={this.state.vaults} />

          <Seperator />
          <Button onClick={this.refreshReceipt}> Get Transaction Receipt </Button>


          <Table bordered responsive>
          <thead>
              <tr>
                <th>Tx Receipt Category</th>
                <th>Values</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>IPFS Hash # stored on Eth Contract</td>
                <td>{this.state.ipfsHash}</td>
              </tr>
              <tr>
                <td>Ethereum Contract Address</td>
                <td>{this.state.ethAddress}</td>
              </tr>
              <tr>
                <td>Tx Hash # </td>
                <td>{this.state.transactionHash}</td>
              </tr>
              <tr>
                <td>Block Number # </td>
                <td>{this.state.blockNumber}</td>
              </tr>
              <tr>
                <td>Gas Used</td>
                <td>{this.state.gasUsed}</td>
              </tr>

            </tbody>
          </Table>
        </Grid>
      </div>
    );
  } //render
} //App
export default App;
