import assertRevert from 'openzeppelin-solidity/test/helpers/assertRevert'
import {advanceBlock} from 'openzeppelin-solidity/test/helpers/advanceToBlock'
import EVMRevert from 'openzeppelin-solidity/test/helpers/EVMRevert'
const DataVault = artifacts.require('DataVault.sol')
const BigNumber = web3.BigNumber

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

contract('DataVault', ([contractCreator, dataOwner]) => {

    beforeEach(async function _ () {
        this.vault = await DataVault.new({from: contractCreator, gasPrice: 0})
        // console.log("Vault Created ", this.vault.address)
    })

    it ('should log events for transfer and store when storing a hash for the first time', async function _() {
        const { logs }  = await this.vault.storeInVault('Test Vault', 'QmfM2r8seH2GiRaC4esTjeraXEachRt8ZsSeGaWTPLyMoG', {from: dataOwner})
        const storeEvent = logs.find(e => e.event === 'DataStored')
        storeEvent.args.vault.should.be.equal('Test Vault')
        storeEvent.args.owner.should.be.equal(dataOwner)

        const transferEvent = logs.find(e => e.event === 'Transfer')
        transferEvent.args._to.should.be.equal(dataOwner)
        console.log("VAULT ID: ", storeEvent.args.vaultId.toString())
        transferEvent.args._tokenId.should.be.bignumber.equal(new BigNumber(storeEvent.args.vaultId))
    })

    it ('should be able to retrieve the hash after stored', async function _() {
        let storedHash = 'QmfM2r8seH2GiRaC4esTjeraXEachRt8ZsSeGaWTPLyMoG'
        await this.vault.storeInVault('TEST', storedHash, {from: dataOwner})
        let hash = await this.vault.getVaultContents('TEST')
        hash.should.be.equal(storedHash)
    })

    it ('should be able to convert string to uint', async function _() {
        let result = await this.vault.encodeShortString("Test Vault")
        let result2 = await this.vault.encodeShortString("Test Vault2")
        let result3 = await this.vault.encodeShortString("TEST Vault")
        let result4 = await this.vault.encodeShortString("TESty Vault")
        result.should.be.bignumber.not.equal(result2).not.equal(result3).not.equal(result4)
    })

})