const { execPromise } = require('./execWrapper')

/* 
    Runs the included dapper npm so that you can view the deployed smart contracts
*/
const runDapper = (program) => {
    console.log(` $ Running Dapper`);

    let command = `yarn start`
    console.log(` $ Starting dapper with command: ${command}`);

    let cwd = `${__dirname}/../node_modules/tool-dapper-react/`
    return execPromise(command, { cwd })
}

module.exports = { runDapper }