const Contract = CONTRACT_REQUIRE

module.exports = function (deployer, _, [contractOwner]) {
  const contractParams = CONTRACT_PARAMS
  return deployer.deploy(Contract, ...contractParams, { from: contractOwner })
}
