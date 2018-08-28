const { execPromise } = require('./execWrapper');

/*
    Wraps truffle migration based on configuration and returns a contracts dictionary
    @param projectDir the directory of the truffle project
    @param network the network (kovan, ropsten, development, ropsten-infura)
    @param excludeContracts which contracts to leave out of the web3 instantiation module (optional)
*/
const migrateTruffle = ({ projectDir, network, excludeContracts }) => {
  console.log(` $ Migrating contracts at ${projectDir}`);

  const command = `${__dirname}/../node_modules/.bin/truffle migrate --network ${network} --reset`;
  console.log(` $ Using truffle command: ${command}`);

  const contracts = [];
  const parser = (data) => {
    // May be a little better to parse actual ABI for the address rather than migration output
    // Forces us to use --reset flag which is always preferred (until it's not?!)
    const nameAddress = data.match(/[\s]*(.*): (0x.*)/);
    if (nameAddress) {
      if (!excludeContracts || !excludeContracts.includes(nameAddress[1])) {
        // console.log("match", nameAddress)
        contracts.push({ name: nameAddress[1], address: nameAddress[2] });
      }
    }
  };

  return execPromise(command, { cwd: projectDir }, parser).then(() => Promise.resolve(contracts));
};

module.exports = { migrateTruffle };
