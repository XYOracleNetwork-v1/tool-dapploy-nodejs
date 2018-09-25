const FungibleToken = artifacts.require(`FungibleToken.sol`)

module.exports = function (deployer, network, [owner1]) {
  return deployer.deploy(FungibleToken, `Fun Token`, `FT`, 18, { from: owner1 })
}
