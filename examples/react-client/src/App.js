import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {web3, IPFSVault, injectWeb3} from './web3';
import ipfs from './ipfs';
import { Button, Grid, Form, Table } from 'react-bootstrap';

const IPFSRow = ({hash}) => {
  return (
    <tr>
      <td>{hash}</td>
      <td><a href={`https://ipfs.infura.io:5001/api/v0/cat?arg=${hash}`}>Contents...</a></td>
    </tr>
  )
}

const IPFSRows = ({ipfsHashes}) => {
  return ipfsHashes.map((hash) => {
    return <IPFSRow hash={hash} />
  })
}

const Vaults = ({vaults}) => {
  return vaults.map((vault) => {
    return (
    <div>
    <tr>
    <td>  Vault </td> 
    <td> { vault.vaultName } </td>
    </tr>
    <IPFSRows vault={vault} />
    </div>
    )
  })
}


class App extends Component {

  componentWillMount() {

    if (!this.state.web3Initialized) {
      injectWeb3()
    }
    console.log("Mounted")
  }

  state = {
    currentVault: 'Test Vault',
    web3Initialized: false,
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
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
  };

  convertToBuffer = async (reader) => {
    //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    this.setState({ buffer });
  };

  onClick = async () => {
    try {
      this.setState({ blockNumber: "waiting.." });
      this.setState({ gasUsed: "waiting..." });
      //get Transaction Receipt in console on click
      //See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
      await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt) => {
        console.log(err, txReceipt);
        this.setState({ txReceipt });
      }); //await for getTransactionReceipt
      await this.setState({ blockNumber: this.state.txReceipt.blockNumber });
      await this.setState({ gasUsed: this.state.txReceipt.gasUsed });
    } 
    catch (error) {
      console.log(error);
    } 
  } 

  getMyBalance = async (beneficiary) => {

  }
    const tokenCount = await QuadToken.methods.balanceOf(beneficiary).call()
  
    return Number(tokenCount)
  }

  onRefresh = async (owner) => {

    const tokenCount = yield getMyBalance(owner)

    IPFSVault.methods.tokenOfOwnerByIndex(owner, this.state.currentVault, this.state.ipfsHash).send({
      from: accounts[0]
    }, (error, transactionHash) => {
      console.log(transactionHash);
      this.setState({ transactionHash });
    }); //IPFSVault 
  }
  
  onClickGetIPFSVault = async () => {
    try {

    } 
    catch (error) {
      console.log(error);
    } 
  } 
  onSubmit = async (event) => {
    event.preventDefault();
    //bring in user's account address
    const accounts = await web3.eth.getAccounts();
    if (accounts[0]) {
      this.setState({web3Initialized: true})
    } else {
      return
    }
    console.log('Sending from account: ' + accounts[0]);
    
    //obtain contract address from web3.js
    const ethAddress = await web3.addressIPFSVault;
    this.setState({ ethAddress });
    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err, ipfsHash);
      //setState by setting ipfsHash to ipfsHash[0].hash 
      this.setState({ ipfsHash: ipfsHash[0].hash });

      IPFSVault.methods.storeInVault(accounts[0], this.state.currentVault, this.state.ipfsHash).send({
        from: accounts[0]
      }, (error, transactionHash) => {
        console.log(transactionHash);
        this.setState({ transactionHash });
      }); //IPFSVault 
    }) //await ipfs.add 
  }; //onSubmit



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
          <Button onClick={this.onClick}> Get Transaction Receipt </Button>

          <Button onClick={this.onClickGetIPFSVault} > Refresh IPFS Vault </Button>
          <Vaults vaults={this.state.vaults} />

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
