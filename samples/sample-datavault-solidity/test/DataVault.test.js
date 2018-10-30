
const DataVault = artifacts.require(`DataVault.sol`)
const BigNumber = web3.BigNumber

const should = require(`chai`)
  .use(require(`chai-as-promised`))
  .use(require(`chai-bignumber`)(BigNumber))
  .should()

contract(`DataVault`, ([contractCreator, dataOwner]) => {
  beforeEach(async function _ () {
    this.vault = await DataVault.new({ from: contractCreator, gasPrice: 0 })
    // console.log("Vault Created ", this.vault.address)
  })

  it(`should log events for transfer and store when storing a hash for the first time`, async function _ () {
    const { logs } = await this.vault.storeInVault(`Test Vault`, `QmfM2r8seH2GiRaC4esTjeraXEachRt8ZsSeGaWTPLyMoG`, { from: dataOwner })
    const storeEvent = logs.find(e => e.event === `DataStored`)
    storeEvent.args.vault.should.be.equal(`Test Vault`)
    storeEvent.args.owner.should.be.equal(dataOwner)

    const transferEvent = logs.find(e => e.event === `Transfer`)

    transferEvent.args.to.should.be.equal(dataOwner)
    transferEvent.args.tokenId.should.be.bignumber.equal(new BigNumber(storeEvent.args.vaultId))
  })

  it(`should be able to convert string to uint`, async function _ () {
    const result = await this.vault.encodeShortString(`Test Vault`)
    const result2 = await this.vault.encodeShortString(`Test Vault2`)
    const result3 = await this.vault.encodeShortString(`TEST Vault`)
    const result4 = await this.vault.encodeShortString(`TESty Vault`)
    result.should.be.bignumber.not.equal(result2).not.equal(result3).not.equal(result4)
  })
})
