#!/usr/bin/env node

/**
 * Module dependencies.
 */
const AWS = require('aws-sdk');
const program = require('commander');
const ConfigParser = require('configparser');
const {logProcess, execPromise} = require('./execWrapper')
const fs = require("fs"); // from node.js
const path = require("path"); // from node.js
const { uploadRemote } = require('./uploadFolder')
const { exportConfig } = require('./web3ConfigExport')
 
program
  .version('0.1.0')
  .option('-t, --truffle <dir>', 'Truffle Project Directory')
  .option('-o, --output <dir>', 'Contract Output Directory')
  .option('-n, --network <network>', 'Deploy to network', 'localhost')
  .option('-c, --config [config]', 'Config file', 'deployer.conf')
  .option('-x, --excludes [Contract1,Contract2]', 'Exclude contracts from the web3 interface (files are still copied)')  
  .option('-clean, --clean', 'Clean contracts before migrating')
  .option('-r, --remoteOnly', 'Only copy contracts remote')
  .option('-s, --skipRemote', 'Skip remote copy')
  .parse(process.argv);

let configParsing = (program, config) => {
    console.log(config.sections())
    if (config.sections().length > 0) {
        program.truffle = config.get('Truffle', 'dir')
        program.output = config.get('Truffle', 'outDir')
        let excludeStr = config.get('Web3', 'excludeContracts')
        if (excludeStr) {
            program.excludes = excludeStr.split(',')
        }
        program.bucketName = config.get('AWS', 'bucketName')
        program.s3AccessKey = config.get('AWS', 's3AccessKey')
        program.secretAccessKey = config.get('AWS', 'secretAccessKey')
        program.web3ModuleOutput = config.get('React', 'web3ModuleOutput')
    } else {
        throw "Bad Config File"
    }
}

const config = new ConfigParser();
try {
    config.read(program.config)
    configParsing(program, config)
} catch (err) {
    console.log("Configuration error")
    console.log(err)
}

let copyContractsRemote = (program) => {
    console.log(` $ Copying contracts to remote at ${program.network}`);
    return uploadRemote(program)
}

let copyContractsLocal = (program) => {
    console.log(` $ Copying contracts locally to ${program.output}`);
    let cp = `cp -p build/contracts/* ${program.output}`
    return execPromise(cp, { cwd: program.truffle })
}

let cleanIfNeeded = program => {
    if (program.clean) {
        let clean = 'rm -rf build'
        console.log(` $ Cleaning build folder at ${program.truffle}`);
        return execPromise(clean, { cwd: program.truffle })
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

let migrateTruffle = (program) => {
    let command = 'truffle migrate --reset'
    let contracts = []
    let parser = (data) => {
        // May be a little better to parse actual ABI for the address rather than migration output
        // Forces us to use --reset flag which is always preferred (until it's not?!)
        let nameAddress = data.match(/[\s]*(.*): (0x.*)/)
        if (nameAddress) {
            if (!program.excludes || !program.excludes.includes(nameAddress[1])) {
                // console.log("match", nameAddress)
                contracts.push({name: nameAddress[1], address: nameAddress[2]})
            }
        }
    }           

    return execPromise(command, { cwd: program.truffle }, parser).then(() => {
        // console.log(contracts)
        return Promise.resolve(contracts)
    })
}


if (!program.truffle) { console.log('Missing truffle directory -t <truffle project path>'); return; }
if (!program.output) { console.log('Missing output directory -o <contract copy path>'); return }

console.log(` $ Compiling contracts at ${program.truffle}`);

if (program.remoteOnly) {
     copyContractsRemote(program)
     return
}

cleanIfNeeded(program).then(() => {
    return migrateTruffle(program)
}).then((contracts) => {
    exportReactModule(program, contracts)
    return copyContractsLocal(program)
}).then(() => {
    if (program.skipRemote) {
        return true
    } 
    return copyContractsRemote(program)
}).catch(err => {
    console.log("Something went wrong")
    console.log(err)
})

