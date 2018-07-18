const shell = require('shelljs');

const templateFile = './web3template.js'
const tempFile = './temp999'
const portisConfigString = (apiKey, network, appName, logoUrl) => `
return new Web3(
    new PortisProvider({
      apiKey: '${apiKey}',
      network: '${network}',
      appName: '${appName}',
      appLogoUrl: '${logoUrl}',
    }),
  )`

let exportConfig = (program, contracts) => {
    shell.cp(templateFile, tempFile)
    shell.sed('-i', 'PORTIS_PROVIDER', portisConfigString, tempFile);
    shell.mv(tempFile, program.web3ModuleOutput)
    return Promise.resolve(true)
}

module.exports = { exportConfig }