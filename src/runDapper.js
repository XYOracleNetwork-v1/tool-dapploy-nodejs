const { execPromise } = require(`./execWrapper`)
const path = require(`path`)

/*
    Runs the included dapper npm so that you can view the deployed smart contracts
*/
const runDapper = (program) => {
  //
  const cwd = `${__dirname}/../node_modules/tool-dapper-react/`

  const relativeAbiPath = path.relative(cwd, program.contractOutput)
  const command = `yarn start ${relativeAbiPath}`
  console.log(` $ Running dapper with command: ${command}`)

  return execPromise(command, { cwd })
  // return runDapperServer(program).then(() => {})
}

// TODO do we need to run server seperately?
const runDapperServer = (program, dapperPath) => {
  const abiDir = `${program.projectDir}/build/contracts`
  console.log(` $ Running Dapper Server for ABI build `, abiDir)

  const command = `yarn server ${abiDir}`

  return execPromise(command, { cwd: dapperPath })
}

module.exports = { runDapper }
