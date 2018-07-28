const IPFSVault = artifacts.require('IPFSVault.sol')


module.exports = function _(deployer, network, [owner1]) {
    return deployer.deploy(IPFSVault, { from: owner1 })
}