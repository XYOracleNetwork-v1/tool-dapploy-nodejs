const shell = require('shelljs');
const templateFile = './src/web3template.js'
const tempFile = './src/temp999'
const portisConfigString = ({portisApiKey, network, appName, logoUrl}) => 
{
    console.log(portisApiKey, network, appName, logoUrl)
    if (!portisApiKey || !appName) {
        // default to localhost if no portis included
        return `return new Web3('http://localhost:8545')`
    } else {
        return `   return new Web3(
            new PortisProvider({
            apiKey: '${portisApiKey}',
            network: '${network}',
            appName: '${appName}',
            appLogoUrl: '${logoUrl}',
            }),
        )`
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

const contractInstantiationString = (contractPath, contracts) => {
    let returnString = '\n'
    for (const contract of contracts) {
        returnString += `\t${contract.name} = new web3.eth.Contract(\n`
        returnString += `\t\trequire('${contractPath}/${contract.name}.json').abi,\n`
        returnString += `\t\taddress${contract.name})\n`
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
    shell.sed('-i', 'CONTRACT_INSTANTIATION', contractInstantiationString(program.contractOutput, contracts), tempFile);

    shell.mv(tempFile, program.web3ModuleOutput)
    return Promise.resolve(true)
}

module.exports = { exportConfig }