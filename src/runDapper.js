const { execPromise } = require(`./execWrapper`)
const path = require(`path`)

/*
    Runs the included dapper npm so that you can view the deployed smart contracts
*/
const runDapper = (program) => {
  const cwd = `${__dirname}/../node_modules/tool-dapper-react/`
  const command = `yarn start`
  console.log(` $ Running dapper with command: ${command}`)

  return execPromise(command, { cwd })
  // return runDapperServer(program).then(() => {})
}

// TODO do we need to run server seperately?
const runDapperServer = (program, dapperPath) => {
  const command = `yarn start`

  return execPromise(command, { cwd: dapperPath })
}

module.exports = { runDapper }
