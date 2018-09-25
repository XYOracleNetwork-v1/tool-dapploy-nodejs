const { exec } = require(`child_process`)

const logProcess = (process, parser) => {
  process.stdout.on(`data`, (data) => {
    console.log(data)
    if (parser) parser(data)
  })
}

const execPromise = (command, options, parser) => new Promise((resolve, reject) => {
  logProcess(
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }

      return resolve({ stdout, stderr })
    }),
    parser
  )
})

module.exports = {
  logProcess,
  execPromise
}
