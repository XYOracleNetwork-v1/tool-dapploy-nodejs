import React from 'react';
import { Table  } from 'react-bootstrap';

export const TransactionReceipt = ({transactionHash, ipfsHash, ethAddress, blockNumber, gasUsed, gasPrice}) => {
    if (!transactionHash) { return null }
    
    return <Table bordered responsive css={{textAlign: 'left'}}>
      <thead>
          <tr>
            <th>Tx Receipt Category</th>
            <th>Values</th>
          </tr>
        </thead>
  
        <tbody>
          <tr>
            <td>IPFS Hash</td>
            <td>{ipfsHash}</td>
          </tr>
          <tr>
            <td>Contract Address</td>
            <td>{ethAddress}</td>
          </tr>
          <tr>
            <td>Tx # </td>
            <td>{transactionHash}</td>
          </tr>
          <tr>
            <td>Block # </td>
            <td>{blockNumber}</td>
          </tr>
          <tr>
            <td>Gas Used</td>
            <td>{gasUsed}</td>
          </tr>
          <tr>
            <td>Gas Price</td>
            <td>{gasPrice}</td>
          </tr>
        </tbody>
      </Table>
  
  }