const shell = require('shelljs');
const path = require('path')
const templateFile = './src/web3template.js'
const tempFile = './src/temp999' // Copy the template to working file for us to modify
const fs = require("fs")

const portisConfigString = ({portisApiKey, network, appName, logoUrl}) => 
{
    if (!portisApiKey || !appName) {
        // default to localhost if no portis included
        return `return new Web3('http://localhost:8545')`
    } else {
        return `return new Web3(new PortisProvider({
            apiKey: '${portisApiKey}',
            network: '${network}',
            appName: '${appName}',
            appLogoUrl: '${logoUrl}',
        }))`
    }
}

const contractDeclarationString = (contracts) => {
    let returnString = ''
    for (const contract of contracts) {
        returnString += `export let ${contract.name}\n`
        returnString += `export const address${contract.name} = '${contract.address}'\n\n`
    }
    return returnString
}

const contractInstantiationString = ({contractOutput, web3ModuleOutput}, contracts) => {
    let relativePath = path.relative(path.dirname(web3ModuleOutput), contractOutput);
    let returnString = '\n'
    for (const contract of contracts) {
        returnString += `\t${contract.name} = new web3.eth.Contract(\n`
        returnString += `\t\trequire('./${relativePath}/${contract.name}.json').abi,\n`
        returnString += `\t\taddress${contract.name})\n`
        returnString += `\t\tSmartContracts.push({name: '${contract.name}', contract: ${contract.name}})\n`

    }
    return returnString
}

let exportConfig = (program, contracts) => {
    shell.cp(templateFile, tempFile)

    if (program.addPortis){
        shell.sed('-i', 'PORTIS_DECLARATION', `import { PortisProvider } from 'portis'`, tempFile);
    } else {
        shell.sed('-i', 'PORTIS_DECLARATION', '', tempFile);
    }
    shell.sed('-i', 'PORTIS_PROVIDER', portisConfigString(program), tempFile);
    shell.sed('-i', 'CONTRACT_DECLARATIONS', contractDeclarationString(contracts), tempFile);
    shell.sed('-i', 'CONTRACT_INSTANTIATION', contractInstantiationString(program, contracts), tempFile);
    console.log("Moving", tempFile, "to", program.web3ModuleOutput)
    const outPath = path.dirname(program.web3ModuleOutput)
    shell.mkdir('-p', outPath)
    if (!fs.existsSync(outPath)) {
        return Promise.reject(`Cannot create web3.js file at ${outPath}`)
    }
    shell.mv(tempFile, program.web3ModuleOutput)
    return Promise.resolve(true)
}

module.exports = { exportConfig }