#!/usr/bin/env node

/**
 * Module dependencies.
 */
const { execPromise } = require('./execWrapper')
const { uploadRemote } = require('./awsFolderUploader')
const { exportConfig } = require('./web3ConfigExporter')
const { parseConfig } = require('./configParser')
const { migrateTruffle } = require('./truffleMigrator')

/* Copies the contracts in the specified project to a local project (react client, etc)

*/
let copyContractsLocal = (program) => {
    console.log(` $ Copying contracts locally to ${program.contractOutput}`);
    let cp = `cp -p build/contracts/* ${program.contractOutput}`
    return execPromise(cp, { cwd: program.projectDir })
}

let cleanIfNeeded = program => {
    if (program.clean) {
        let clean = 'rm -rf build'
        console.log(` $ Cleaning build folder at ${program.projectDir}`);
        return execPromise(clean, { cwd: program.projectDir })
    } else {
        console.log(` $ Skipping cleaning (use -clean for clean migration)`);
        return Promise.resolve()
    }
}

let createWeb3Module = (program, contracts) => {
    if (program.web3ModuleOutput) {
        console.log(` $ Exporting Web3 module to ${program.web3ModuleOutput}`);
        exportConfig(program, contracts)
    }
}

/* ** Main Program **

    @description - This program may be configured using parameter options below
    Makes it simple to deploy your contracts to whatever network

    Ex: Deploy to ropsten

    1) Configure your 


*/
const program = require('commander');

program
  .version('0.1.0')
  .option('-t, --truffle <dir>', 'Truffle Project Directory')
  .option('-o, --output <dir>', 'Contract Output Directory')
  .option('-n, --network <network>', 'Deploy to network')
  .option('-c, --config [config]', 'Config file', '../deployer.conf')
  .option('-x, --excludes [Contract1,Contract2]', 'Exclude contracts from the web3 interface (files are still copied)')  
  .option('-clean, --clean', 'Clean contracts before migrating')
  .option('-r, --remoteOnly', 'Only copy contracts remote')
  .option('-s, --skipAWS', 'Skip remote copy to aws config')
  .option('-p, --networkPrivateKey', 'Private Key for migrating to network')
  .parse(process.argv);


try {
    parseConfig(program)
} catch (err) {
    console.log("Configuration error, possibly corrupt configuration file present")
    console.log(err)
    return
}

if (program.remoteOnly) {
    return uploadRemote(program)
}

cleanIfNeeded(program).then(() => {
    return migrateTruffle(program)
}).then((contracts) => {
    createWeb3Module(program, contracts)
    return copyContractsLocal(program)
}).then(() => {
    if (program.skipAWS) {
        return true
    } 
    return uploadRemote(program)
}).catch(err => {
    console.log("Something went wrong")
    console.log(err)
})

