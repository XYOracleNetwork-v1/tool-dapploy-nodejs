const Contract = CONTRACT_REQUIRE

const contractParams = CONTRACT_PARAMS

module.exports = function (deployer, _, [owner1]) {
  return deployer.deploy(Contract, ...contractParams, { from: owner1 })
}
