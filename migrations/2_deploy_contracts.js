const LRGToken = artifacts.require('LRGToken.sol')


module.exports = function _(deployer, network, [owner1]) {
    return deployer.deploy(LRGToken, { from: owner1 })
}