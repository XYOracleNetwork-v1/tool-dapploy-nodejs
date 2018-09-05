const path = require(`path`) // from node.js
const { uploadRemote } = require(`./awsFolderUploader`)
const { migrateTruffle } = require(`./truffleMigrator`)
const { execPromise } = require(`./execWrapper`)
const { exportConfig } = require(`./web3ConfigExporter`)

/* Copies the contracts in the specified project to a local project (react client, etc)

*/
const copyContractsLocal = (program) => {
  const fromPath = path.join(program.projectDir, `build/contracts/*`)
  console.log(` $ Copying contracts locally to ${program.contractOutput}`)

  if (fromPath === program.contractOutput) {
    console.log(` $ From path is equal to path, ignoring copy`)
    // if contract output is equal to fromPath, just let it
    return Promise.resolve()
  }
  const cp = `cp -p ${fromPath} ${program.contractOutput}`
  return execPromise(cp)
}

const cleanIfNeeded = (program) => {
  if (program.clean) {
    const clean = `rm -rf build`
    console.log(` $ Cleaning build folder at ${program.projectDir}`)
    return execPromise(clean, { cwd: program.projectDir })
  }
  return new Promise((resolve, reject) => {
    console.log(` $ Skipping cleaning (use -clean for clean migration)`)
    resolve()
  })

  // return Promise.resolve()
}

const createWeb3Module = (program, contracts) => {
  if (program.web3ModuleOutput) {
    console.log(` $ Exporting Web3 module to ${program.web3ModuleOutput}`)
    exportConfig(program, contracts)
  }
}

const dapploy = (program) => {
  console.log(`Running dapploy`)

  if (program.remoteOnly) {
    return uploadRemote(program)
  }

  return cleanIfNeeded(program)
    .then(() => {
      if (program.copyOnly) {
        console.log(` # Skipping Migration`)
        return Promise.resolve(undefined)
      }
      console.log(` # Migration called`)

      return migrateTruffle(program)
    })
    .then((contracts) => {
      if (contracts) {
        createWeb3Module(program, contracts)
      }
      return copyContractsLocal(program)
    })
    .then(() => {
      if (program.skipAWS) {
        return Promise.resolve(undefined)
      }
      return uploadRemote(program)
    })
}

module.exports = { dapploy }
