const ConfigParser = require(`configparser`)

const config = new ConfigParser()
const untildify = require(`untildify`)
const fs = require(`fs`)

/* eslint no-param-reassign: "error" */
const parseParams = (program, section, params) => {
  params.forEach((param) => {
    const parsedParam = config.get(section, param)
    if (parsedParam && !program[param]) {
      program[param] = untildify(parsedParam)
    }
  })
}

const configParsing = (program) => {
  if (config.sections().length > 0) {
    const abiDir = config.get(`Truffle`, `contractOutput`)
    if (abiDir) {
      program.contractOutput = abiDir
    }
    parseParams(program, `Truffle`, [`projectDir`, `network`])

    if (config.sections().includes(`AWS`)) {
      parseParams(program, `AWS`, [`bucketName`, `remotePath`])
    }

    if (config.sections().includes(`Web3`)) {
      parseParams(program, `Web3`, [`web3ClientPath`, `web3ServerPath`])
      const excludeStr = config.get(`Web3`, `excludeContracts`)
      if (excludeStr) {
        program.excludeContracts = excludeStr.split(`,`)
      }
    }

    const includeStr = config.get(`Web3`, `includeContracts`)
    if (includeStr) {
      program.includeContracts = includeStr.split(`,`)
    }

    if (config.sections().includes(`Portis`)) {
      parseParams(program, `Portis`, [`portisApiKey`, `infuraApiKey`])
    }
  } else {
    console.log(`Empty config file, using defaults`)
  }
}

const parseConfig = (program) => {
  console.log(` $ Parsing config`, program.config)
  try {
    config.read(program.config)
  } catch (err) {
    console.log(`Invalid or missing config, using defaults`)
    return
  }
  configParsing(program)
}

const initConfig = (program) => {
  let projectDir = program.initPath || `./`
  if (projectDir.charAt(projectDir.length - 1) !== `/`) {
    projectDir += `/`
  }
  const configFile = `${projectDir}.dapploy`
  if (fs.existsSync(configFile)) {
    throw new Error(
      `A config file was found at: ${configFile}. Stopping to prevent overwriting data.`
    )
  }
  console.log(` $ Creating config file at ${configFile}`)
  // Adding sections and adding keys
  config.addSection(`Truffle`)
  config.set(`Truffle`, `projectDir`, `./`)
  config.set(`Truffle`, `network`, `development`)
  config.set(`Truffle`, `contractOutput`, `./src/ABI`)

  config.addSection(`Web3`)
  config.set(`Web3`, `web3ClientPath`, `./src/web3Adapter-client.js`)
  config.set(`Web3`, `web3ServerPath`, `./src/web3Adapter-server.js`)
  config.set(`Web3`, `excludeContracts`, `Migrations`)

  config.write(configFile)

  console.log(`$ Make sure you configure a "development" network in truffle.js`)
  return Promise.resolve(true)
}

module.exports = { parseConfig, initConfig }
