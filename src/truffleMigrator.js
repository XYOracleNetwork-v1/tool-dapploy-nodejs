const { execPromise } = require(`./execWrapper`)

/*
    Wraps truffle migration based on configuration and returns a contracts dictionary
    @param projectDir the directory of the truffle project
    @param network the network (kovan, ropsten, development, mainnet)
    @param excludeContracts which contracts to leave out of the web3 instantiation module (optional)
*/
const migrateTruffle = ({
  projectDir,
  network,
  excludeContracts,
  includeContracts
}) => {
  console.log(` $ Migrating contracts at ${projectDir}`)

  if (!projectDir || !network) {
    throw new Error(
      `Missing projectDir or network, are you missing a .dapploy file?`
    )
  }
  const command = `${__dirname}/../node_modules/.bin/truffle migrate --network ${network} --reset`
  console.log(` $ Using truffle command: ${command}`)

  const contracts = []
  const parser = (data) => {
    const nameAddress = data.match(/[\s]*(.*): (0x.*)/)
    if (nameAddress) {
      if (!excludeContracts || !excludeContracts.includes(nameAddress[1])) {
        // if nothing excluded or is not in the excludes, add contract
        if (includeContracts) {
          if (includeContracts.includes(nameAddress[1])) {
            // included contracts exists, so add if in includeContracts
            contracts.push({ name: nameAddress[1], address: nameAddress[2] })
          }
        } else {
          // include contracts not specified, so add by default
          contracts.push({ name: nameAddress[1], address: nameAddress[2] })
        }
      } else if (
        includeContracts &&
        includeContracts.includes(nameAddress[1])
      ) {
        // include overrides exclude
        Promise.reject(
          new Error(`Cannot include and exclude the same contract!`)
        )
      }
    }
  }

  return execPromise(command, { cwd: projectDir }, parser).then(() => Promise.resolve(contracts))
}

module.exports = { migrateTruffle }
