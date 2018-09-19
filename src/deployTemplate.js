const { execPromise } = require(`./execWrapper`)

const distPath = `./dapp`
const deployTemplate = (program) => {
  const templatePath = `${__dirname}/../samples/sample-template-solidity/`
  console.log(` $ Creating truffle project in ${distPath} from ${templatePath}`)

  console.log(`Copying ${templatePath} to ${distPath}`)
  // Copy to temp folder before moving to destination in case src and dest are the same
  // Is there a cleaner way?
  // cp -rfpiU... all just throw errors when src == dest, and paths strings
  const cp = `mkdir -p ${distPath} && \
  cp -rp ${templatePath} ${distPath}`
  return execPromise(cp)
}

const buildAndDeployTemplate = program => deployTemplate().then(() => {
  console.log(`$ Building template`)
  return execPromise(`cd ${distPath} && yarn`)
})

module.exports = { deployTemplate, buildAndDeployTemplate }
