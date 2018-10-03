const { execPromise } = require(`./execWrapper`)
const shell = require(`shelljs`)
const supported = [`ERC20`, `ERC721`, `RefundEscrow`]

const updateMigration = (distPath, whichContract) => {
  const migrationFile = `${distPath}/migrations/2_deploy_contracts.js`
  let parameters
  switch (whichContract) {
    case `ERC721`: {
      parameters = `[\`Fun Token\`, \`FT\`]`
      break
    }
    case `RefundEscrow`: {
      parameters = `[contractOwner]`
      break
    }
    case `CappedCrowdsale`: {
      // TODO add support for multiple contract instantiations
      parameters = `[[1000],[10000, contractOwner, contract0]]`
      break
    }
    default: {
      parameters = `[\`Fun Token\`, \`FT\`, 18, 100000000]`
    }
  }
  const requireString = `artifacts.require(\`${whichContract}Adapter.sol\`)`
  console.log(` $ Updating Migration file:`, migrationFile)
  shell.sed(`-i`, `CONTRACT_PARAMS`, parameters, migrationFile)
  shell.sed(`-i`, `CONTRACT_REQUIRE`, requireString, migrationFile)
}

const deployTemplate = (distPath, whichContract) => {
  const templatePath = `${__dirname}/../templates/template-solidity/`
  console.log(` $ Creating truffle project in ${distPath} from ${templatePath}`)
  console.log(` $ Copying ${templatePath} to ${distPath}`)

  // Copy to temp folder before moving to destination in case src and dest are the same
  // Is there a cleaner way?
  // cp -rfpiU... all just throw errors when src == dest, and paths strings
  const cp = `mkdir -p ${distPath} && \
  cp -rp ${templatePath} ${distPath} && \
  cp ${distPath}/adapters/${whichContract}Adapter.sol ${distPath}/contracts/`
  return execPromise(cp)
}

const getTemplateContract = (program) => {
  let whichContract = `ERC20` // default
  if (program.specifyContract && supported.includes(program.specifyContract)) {
    whichContract = program.specifyContract
  } else {
    console.log(
      `$ Unsupported contract type, ${
        program.specifyContract
      } using default. The following contracts are supported: ${supported} `
    )
  }
  console.log(` $ Initializing project with ${whichContract} `)

  return whichContract
}

const buildAndDeployTemplate = (program) => {
  const distPath = program.initPath || `./`
  const whichContract = getTemplateContract(program)
  return deployTemplate(distPath, whichContract).then(() => {
    updateMigration(distPath, whichContract)
    console.log(` $ Building template`)
    return execPromise(`cd ${distPath} && yarn`)
  })
}
module.exports = { supported, buildAndDeployTemplate }
