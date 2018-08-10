const DataVault = artifacts.require('DataVault.sol')


module.exports = function _(deployer, network, [owner1]) {
    return deployer.deploy(DataVault, { from: owner1 })
}