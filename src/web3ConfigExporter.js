const shell = require(`shelljs`)
const path = require(`path`)

const getTempFile = type => `./temp999-${type}` // Copy the template to working file for us to modify
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

const contractInstantiationString = (program, contracts, type) => {
  let { contractOutput } = program
  const { projectDir } = program
  const web3AdapterPath =
    type === `client` ? program.web3ClientPath : program.web3ServerPath
  if (!contractOutput) {
    contractOutput = `${projectDir}/build/contracts`
  }
  const relativePath = path.relative(
    path.dirname(web3AdapterPath),
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

const exportClientConfig = (program, contracts) => {
  const tempFile = getTempFile(`client`)
  copyTemplate(`client`)
  shell.sed(
    `-i`,
    `PORTIS_DECLARATION`,
    `import { PortisProvider } from 'portis'`,
    tempFile
  )
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
    contractInstantiationString(program, contracts, `client`),
    tempFile
  )
  return moveTemplateTo(tempFile, program.web3ClientPath)
}

const copyTemplate = (type) => {
  const templateFile = `${__dirname}/../templates/template-web3-${type}.js`
  const tempFile = getTempFile(type)
  // console.log(`Copying`, templateFile, `to`, tempFile)
  shell.cp(templateFile, tempFile)
}

const exportServerConfig = (program, contracts) => {
  const tempFile = getTempFile(`server`)
  copyTemplate(`server`)

  shell.sed(
    `-i`,
    `CONTRACT_DECLARATIONS`,
    contractDeclarationString(contracts),
    tempFile
  )
  shell.sed(
    `-i`,
    `CONTRACT_INSTANTIATION`,
    contractInstantiationString(program, contracts, `server`),
    tempFile
  )

  return moveTemplateTo(tempFile, program.web3ServerPath)
}

const moveTemplateTo = (tempFile, web3Path) => {
  const outPath = path.dirname(web3Path)
  shell.mkdir(`-p`, outPath)
  if (!fs.existsSync(outPath)) {
    return Promise.reject(new Error(`Cannot create web3 adapter at ${outPath}`))
  }
  console.log(` $ Moving template to`, web3Path)
  shell.mv(tempFile, web3Path)
  return Promise.resolve(true)
}

module.exports = { exportClientConfig, exportServerConfig }
