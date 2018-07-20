const { execPromise } = require('./execWrapper')


let migrateTruffle = (program) => {
    console.log(` $ Migrating contracts at ${program.projectDir}`);

    let command = `truffle migrate --network ${program.network} --reset`


    console.log(` $ Using truffle command: ${command}`);

    let contracts = []
    let parser = (data) => {
        // May be a little better to parse actual ABI for the address rather than migration output
        // Forces us to use --reset flag which is always preferred (until it's not?!)
        let nameAddress = data.match(/[\s]*(.*): (0x.*)/)
        if (nameAddress) {
            if (!program.excludeContracts || !program.excludeContracts.includes(nameAddress[1])) {
                // console.log("match", nameAddress)
                contracts.push({name: nameAddress[1], address: nameAddress[2]})
            }
        }
    }           

    return execPromise(command, { cwd: program.projectDir }, parser).then(() => {
        // console.log(contracts)
        return Promise.resolve(contracts)
    })
}

module.exports = { migrateTruffle }