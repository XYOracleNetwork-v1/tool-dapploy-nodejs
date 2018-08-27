const shell = require('shelljs');
const path = require('path')
const templateFile = `${__dirname}/web3template.js`

const tempFile = '/tmp/temp999' // Copy the template to working file for us to modify
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
    }
    return returnString
}

const contractInstantiationString = ({contractOutput, web3ModuleOutput}, contracts) => {
    let relativePath = path.relative(path.dirname(web3ModuleOutput), contractOutput);
    let returnString = '\n'
    
    for (const contract of contracts) {
        let address = `address${contract.name}`
        let json = `json${contract.name}`
        returnString += `\t\const ${json} = require('./${relativePath}/${contract.name}.json')\n`
        returnString += `\t\tif (${json} && ${json}.networks[netId]) {\n`
        returnString += `\t\t\tconst ${address} = ${json}.networks[netId].address\n`
        returnString += `\t\t\t${contract.name} = new web3.eth.Contract(\n`
        returnString += `\t\t\t${json}.abi,\n`
        returnString += `\t\t\t${address})\n`
        returnString += `\t\t\tSmartContracts.push({name: '${contract.name}', contract: ${contract.name}, address: ${address}})\n`
        returnString += `\t\t}\n`
    }
    return returnString
}

let exportConfig = (program, contracts) => {
    console.log("Copying", templateFile, "to", tempFile)
    shell.cp(templateFile, tempFile)

    if (program.addPortis){
        shell.sed('-i', 'PORTIS_DECLARATION', `import { PortisProvider } from 'portis'`, tempFile);
    } else {
        shell.sed('-i', 'PORTIS_DECLARATION', '', tempFile);
    }
    shell.sed('-i', 'PORTIS_PROVIDER', portisConfigString(program), tempFile);
    shell.sed('-i', 'CONTRACT_DECLARATIONS', contractDeclarationString(contracts), tempFile);
    shell.sed('-i', 'CONTRACT_INSTANTIATION', contractInstantiationString(program, contracts), tempFile);
    const outPath = path.dirname(program.web3ModuleOutput)
    shell.mkdir('-p', outPath)
    if (!fs.existsSync(outPath)) {
        return Promise.reject(`Cannot create web3.js file at ${outPath}`)
    }
    if (program.dapper) {
        let dapperDest = __dirname + '/../node_modules/tool-dapper-react/src/web3.js'
        console.log(" $ Copying dapper interface from ", tempFile, "to", dapperDest)
        shell.cp(tempFile, dapperDest)
    }
    console.log(" $ Moving", tempFile, "to", program.web3ModuleOutput)
    shell.mv(tempFile, program.web3ModuleOutput)
    return Promise.resolve(true)
}

module.exports = { exportConfig }