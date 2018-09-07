const ConfigParser = require(`configparser`)

const config = new ConfigParser()
const untildify = require(`untildify`)
const fs = require(`fs`)

/* eslint no-param-reassign: "error" */
const parseParams = (program, section, params) => {
  params.forEach((param) => {
    const parsedParam = config.get(section, param)
    if (parsedParam) {
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
      parseParams(program, `AWS`, [`bucketName`])
    }

    if (config.sections().includes(`Web3`)) {
      parseParams(program, `Web3`, [`web3ModuleOutput`])
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
      program.addPortis = true
      parseParams(program, `Portis`, [`portisApiKey`, `appName`, `logoUrl`])
    }
  } else {
    console.log(`Empty config file, using defaults`)
  }
}

const validateProgramRequirements = (program) => {
  const requiredParams = [`network`, `projectDir`]
  requiredParams.forEach((param) => {
    if (!program[param]) {
      throw new Error(
        `Missing param: ${param}, add to configuration file or pass in param`
      )
    }
  })
  if (!fs.existsSync(program.projectDir)) {
    throw new Error(
      `A truffle project was not found at path: ${program.projectDir}`
    )
  }
  if (program.contractOutput && !fs.existsSync(program.contractOutput)) {
    throw new Error(
      `A contract ABI copy destination path does not exist: ${
        program.contractOutput
      }`
    )
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
  validateProgramRequirements(program)
}

module.exports = { parseConfig }
