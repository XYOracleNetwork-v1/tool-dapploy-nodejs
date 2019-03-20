const path = require(`path`) // from node.js
const { uploadRemote } = require(`./awsFolderUploader`)
const { migrateTruffle, contractDataOnNetwork } = require(`./truffleMigrator`)
const { execPromise } = require(`./execWrapper`)
const {
  exportClientConfig,
  exportServerConfig
} = require(`./web3ConfigExporter`)
const { uploadIPFS } = require(`./ipfsUploader`)
const tempContractsOutput = `/tmp/tempContractsOutputFolder`
/* Copies the contracts in the specified project to a local project (react client, etc)

*/
const copyContractsLocal = (program) => {
  if (!program.contractOutput) {
    console.log(
      ` $ Skipping local copy add contractOutput param if you want to copy the ABI locally`
    )
    return Promise.resolve()
  }
  const fromPath = path.join(program.projectDir, `build/contracts/*`)
  console.log(` $ Copying contracts locally to ${program.contractOutput}`)

  if (fromPath === program.contractOutput) {
    console.log(` $ From path is equal to path, ignoring copy`)
    // if contract output is equal to fromPath, just let it
    return Promise.resolve()
  }
  // Copy to temp folder before moving to destination in case src and dest are the same
  // Is there a cleaner way?
  // cp -rfpiU... all just throw errors when src == dest, and paths strings
  const cp = `mkdir -p ${tempContractsOutput} && 
  mkdir -p ${program.contractOutput} && \
  cp -p ${fromPath} ${tempContractsOutput} && \
  mv ${tempContractsOutput}/* ${program.contractOutput} && \
  rm -rf ${tempContractsOutput}`
  return execPromise(cp)
}

const cleanIfNeeded = (program) => {
  if (program.clean) {
    const clean = `rm -rf build`
    console.log(` $ Cleaning build folder at ${program.projectDir}`)
    return execPromise(clean, { cwd: program.projectDir })
  }
  console.log(` $ Skipping cleaning (use -l for clean migration)`)

  return Promise.resolve()
}

const createWeb3Module = (program, contracts) => {
  if (program.web3ClientPath) {
    console.log(` $ Exporting Web3 Client module to ${program.web3ClientPath}`)
    exportClientConfig(program, contracts)
  }
  if (program.web3ServerPath) {
    console.log(` $ Exporting Web3 Server module to ${program.web3ServerPath}`)
    exportServerConfig(program, contracts)
  }
  if (program.web3Adapters) {
    process.exit(0)
  }
}

const dapploy = async (program) => {
  console.log(`Running dapploy`)

  if (program.remoteOnly) {
    return uploadRemote(program)
  }
  if (program.pinToIpfs) {
    return uploadIPFS(program)
  }

  return cleanIfNeeded(program)
    .then(() => {
      if (program.copyOnly) {
        console.log(` # Skipping Migration`)
        return Promise.resolve(undefined)
      }
      if (program.web3Adapters) {
        return contractDataOnNetwork(program.contractOutput, program.network)
      }
      return migrateTruffle(program)
    })
    .then((contracts) => {
      if (contracts) {
        createWeb3Module(program, contracts)
      }
      return copyContractsLocal(program)
    })
    .then(async () => {
      if (program.bucketName) {
        console.log(` # Uploading to AWS bucket`)
        await uploadRemote(program)
      }
      if (program.postSaveToIpfs) {
        console.log(` # Upoading to IPFS`)
        await uploadIPFS(program)
      }
      return Promise.resolve(undefined)
    })
}

module.exports = { dapploy }
