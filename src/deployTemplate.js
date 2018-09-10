const { execPromise } = require(`./execWrapper`)

const deployTemplate = (program) => {
  const templatePath = `${__dirname}/../samples/sample-template-solidity`
  console.log(` $ Creating truffle project in ./dist from ${templatePath}`)

  // Copy to temp folder before moving to destination in case src and dest are the same
  // Is there a cleaner way?
  // cp -rfpiU... all just throw errors when src == dest, and paths strings
  const cp = `mkdir -p ./dist && \
  cp -rp ${templatePath} ./dist`
  return execPromise(cp)
}

const buildAndDeployTemplate = program => deployTemplate().then(() => {
  console.log(`$ Building template`)
  return execPromise(`cd ./dist && yarn`)
})

module.exports = { deployTemplate, buildAndDeployTemplate }
