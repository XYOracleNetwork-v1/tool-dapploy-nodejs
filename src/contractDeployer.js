#!/usr/bin/env node

/**
 * Module dependencies.
 */
const { execPromise } = require('./execWrapper')
const { uploadRemote } = require('./uploadFolder')
const { exportConfig } = require('./web3ConfigExport')
const { parseConfig } = require('./configParser.js')
const { migrateTruffle } = require('./truffleMigration')

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

let exportReactModule = (program, contracts) => {
    if (program.web3ModuleOutput) {
        console.log(` $ Exporting React module to ${program.web3ModuleOutput}`);
        exportConfig(program, contracts)
    }
}



// ** Main Program **

const program = require('commander');

program
  .version('0.1.0')
  .option('-t, --truffle <dir>', 'Truffle Project Directory')
  .option('-o, --output <dir>', 'Contract Output Directory')
  .option('-n, --network <network>', 'Deploy to network')
  .option('-c, --config [config]', 'Config file', 'deployer.conf')
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
    exportReactModule(program, contracts)
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

