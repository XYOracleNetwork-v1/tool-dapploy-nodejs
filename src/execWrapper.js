const { exec } = require('child_process')

let logProcess = (process, parser) => {
    process.stdout.on('data', function(data) {
        console.log(data)
        if (parser) parser(data)
    })
}

let execPromise = (command, options, parser) => {
    return new Promise(function(resolve, reject) {
        logProcess(exec(command, options, function(error, stdout, stderr) {
        if (error) {
            return reject(error);
        }

        resolve({stdout, stderr});
        }), parser
    )})
}

module.exports = {
    logProcess, execPromise
}

