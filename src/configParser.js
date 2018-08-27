
const ConfigParser = require('configparser')
const config = new ConfigParser()
const untildify = require('untildify')
const fs = require("fs")

let parseParams = (program, section, params) => {
    for (const param of params) {
        if (!program[param]) {
            program[param] = untildify(config.get(section, param))
        }
    }
}

let configParsing = (program) => {
    
    if (config.sections().length > 0) {
        parseParams(program, "Truffle", ['projectDir', 'contractOutput', 'network'])

        if (config.sections().includes("AWS")) {
            parseParams(program, "AWS", ['bucketName']) 
        } else {
            program.skipAWS = true
        }
 
        parseParams(program, "Web3", ['web3ModuleOutput'])
        const excludeStr = config.get('Web3', 'excludeContracts')
        if (excludeStr) {
            program.excludeContracts = excludeStr.split(',')
        }

        if (config.sections().includes("Portis")){
            program.addPortis = true
            parseParams(program, "Portis", ['portisApiKey', 'appName', 'logoUrl'])
        }

    } else {
        throw new Error("Bad Config File")
    }
}

let validateProgramRequirements = (program) => {
    let requiredParams = ['network', 'projectDir', 'contractOutput']
    for (const param of requiredParams) {
        if (!program[param]) {
            throw new Error(`Missing param: ${param}, add to configuration file or pass in param`)
        }
    }
    if (!fs.existsSync(program['projectDir'])) {
        throw new Error(`The truffle project not found at path: ${program['projectDir']}`)
    }
    if (!fs.existsSync(program['contractOutput'])) {
        throw new Error(`The contract ABI destination path does not exist: ${program['contractOutput']}`)
    }
}

let parseConfig = (program) => {

    console.log(" $ Parsing config", program.config)
    config.read(program.config)
    configParsing(program)
    validateProgramRequirements(program)
}

module.exports = { parseConfig }