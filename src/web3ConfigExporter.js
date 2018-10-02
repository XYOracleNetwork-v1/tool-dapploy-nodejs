const shell = require(`shelljs`)
const path = require(`path`)

const templateFile = `${__dirname}/../templates/template-web3.js`

const tempFile = `/tmp/temp999` // Copy the template to working file for us to modify
const fs = require(`fs`)

const portisConfigString = ({ portisApiKey, network, infuraApiKey }) => {
  if (portisApiKey) {
    const allowedNetworks = [
      `mainnet`,
      `ropsten`,
      `kovan`,
      `rinkeby`,
      `sokol`,
      `core`
    ]
    if (allowedNetworks.includes(network)) {
      return `return new Web3(new PortisProvider({
            apiKey: '${portisApiKey}',
            network: '${network}',
        }))`
    }
    if (infuraApiKey) {
      return `return new Web3(new PortisProvider({
            apiKey: '${portisApiKey}',
            infuraApiKey: '${infuraApiKey}',
            network: '${network}',
        }))`
    }
  }
  // default to localhost if no metamask, use portis
  return `return new Web3(new PortisProvider({
        providerNodeUrl: 'http://localhost:8545',
    }))`
}

const contractDeclarationString = (contracts) => {
  let returnString = ``
  contracts.forEach((contract) => {
    returnString += `export let ${contract.name}\n`
  })

  return returnString
}

const contractInstantiationString = (params, contracts) => {
  let { contractOutput } = params
  const { web3ModuleOutput } = params
  if (!contractOutput) {
    contractOutput = `/add/abi/path/to/config`
  }
  const relativePath = path.relative(
    path.dirname(web3ModuleOutput),
    contractOutput
  )
  let returnString = `\n`

  contracts.forEach((contract) => {
    const address = `address${contract.name}`
    const json = `json${contract.name}`
    returnString += `\t\tconst ${json} = require('./${relativePath}/${
      contract.name
    }.json')\n`
    returnString += `\t\tif (${json} && ${json}.networks[netId]) {\n`
    returnString += `\t\t\tconst ${address} = ${json}.networks[netId].address\n`
    returnString += `\t\t\t${contract.name} = new web3.eth.Contract(\n`
    returnString += `\t\t\t${json}.abi,\n`
    returnString += `\t\t\t${address})\n`
    returnString += `\t\t\tSmartContracts.push({name: '${
      contract.name
    }', contract: ${contract.name}, address: ${address}})\n`
    returnString += `\t\t}\n`
  })
  return returnString
}

const exportConfig = (program, contracts) => {
  console.log(`Copying`, templateFile, `to`, tempFile)
  shell.cp(templateFile, tempFile)

  if (program.addPortis) {
    shell.sed(
      `-i`,
      `PORTIS_DECLARATION`,
      `import { PortisProvider } from 'portis'`,
      tempFile
    )
  } else {
    shell.sed(`-i`, `PORTIS_DECLARATION`, ``, tempFile)
  }
  shell.sed(`-i`, `PORTIS_PROVIDER`, portisConfigString(program), tempFile)
  shell.sed(
    `-i`,
    `CONTRACT_DECLARATIONS`,
    contractDeclarationString(contracts),
    tempFile
  )
  shell.sed(
    `-i`,
    `CONTRACT_INSTANTIATION`,
    contractInstantiationString(program, contracts),
    tempFile
  )
  const outPath = path.dirname(program.web3ModuleOutput)
  shell.mkdir(`-p`, outPath)
  if (!fs.existsSync(outPath)) {
    return Promise.reject(new Error(`Cannot create web3 adaptor at ${outPath}`))
  }
  console.log(` $ Moving`, tempFile, `to`, program.web3ModuleOutput)
  shell.mv(tempFile, program.web3ModuleOutput)
  return Promise.resolve(true)
}

module.exports = { exportConfig }
