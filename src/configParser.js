
const ConfigParser = require('configparser');
const config = new ConfigParser();

let parseParams = (program, section, params) => {
    for (const param of params) {
        if (!program[param]) {
            program[param] = config.get(section, param)
        }
    }
}

let configParsing = (program) => {
    console.log(config.sections())
    
    if (config.sections().length > 0) {
        parseParams(program, "Truffle", ['projectDir', 'contractOutput', 'network'])

        if (config.sections().includes("AWS")) {
            parseParams(program, "AWS", ['bucketName', 's3AccessKey', 'secretAccessKey']) 
        } else {
            program.skipAWS = true
        }
 
        parseParams(program, "React", ['web3ModuleOutput'])
        const excludeStr = config.get('React', 'excludeContracts')
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
        console.log("Param:", program[param])
        if (!program[param]) {
            throw new Error(`Missing param: ${param}, add to configuration file or pass in param`)
        }
    }
}

let parseConfig = (program) => {
    // program.config default is deployer.conf
    config.read(program.config)
    configParsing(program)
    validateProgramRequirements(program)

}

module.exports = { parseConfig }