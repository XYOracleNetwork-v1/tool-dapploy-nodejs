import assertRevert from 'openzeppelin-solidity/test/helpers/assertRevert'
import {advanceBlock} from 'openzeppelin-solidity/test/helpers/advanceToBlock'
import EVMRevert from 'openzeppelin-solidity/test/helpers/EVMRevert'
const IPFSVault = artifacts.require('IPFSVault.sol')
const BigNumber = web3.BigNumber

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

contract('IPFSVault', ([contractCreator, ipfsOwner]) => {

    beforeEach(async function _ () {
        this.vault = await IPFSVault.new({from: contractCreator, gasPrice: 0})
        console.log("Vault Created ", this.vault.address)
    })

    it ('should log events for transfer and store when storing a hash for the first time', async function _() {
        const { logs }  = await this.vault.storeInVault('TEST', 'QmfM2r8seH2GiRaC4esTjeraXEachRt8ZsSeGaWTPLyMoG', {from: ipfsOwner})
        const storeEvent = logs.find(e => e.event === 'IPFSStored')
        storeEvent.args.vault.should.be.equal("TEST")
        storeEvent.args.owner.should.be.equal(ipfsOwner)

        const transferEvent = logs.find(e => e.event === 'Transfer')
        transferEvent.args._to.should.be.equal(ipfsOwner)
        transferEvent.args._tokenId.should.be.bignumber.equal(new BigNumber(storeEvent.args.vaultId))
    })

    it ('should be able to retrieve the hash after stored', async function _() {
        let storedHash = 'QmfM2r8seH2GiRaC4esTjeraXEachRt8ZsSeGaWTPLyMoG'
        await this.vault.storeInVault('TEST', storedHash, {from: ipfsOwner})
        let hash = await this.vault.getVault('TEST')
        console.log(hash)
        hash.should.be.equal(storedHash)
    })

})