const Contract = artifacts.require(`ERC20Adapter.sol`)

module.exports = function (deployer, _, [contractOwner]) {
  const contractParams = [`Fun Token`, `FT`, 18, 100000000]
  return deployer.deploy(Contract, ...contractParams, { from: contractOwner })
}
