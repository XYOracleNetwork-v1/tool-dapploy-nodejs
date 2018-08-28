const { execPromise } = require('./execWrapper');

/*
    Runs the included dapper npm so that you can view the deployed smart contracts
*/
const runDapper = () => {
  console.log(' $ Running Dapper');

  const command = 'yarn start';
  console.log(` $ Starting dapper with command: ${command}`);

  const cwd = `${__dirname}/../node_modules/tool-dapper-react/`;
  return execPromise(command, { cwd });
};

module.exports = { runDapper };
