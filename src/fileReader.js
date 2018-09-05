const fs = require(`fs`) // from node.js
const path = require(`path`) // from node.js

// get of list of files from 'dir' directory
const readDir = dir => new Promise((resolve, reject) => {
  const resolvePath = dir
  fs.readdir(resolvePath, (err, files) => {
    if (!files || files.length === 0) {
      console.log(
        `provided folder '${resolvePath}' is empty or does not exist.`
      )
      console.log(`Make sure your project was compiled!`)
      return reject(err)
    }
    // get the full paths of the file
    const filePaths = files.map(fileName => path.join(resolvePath, fileName))
    return resolve(filePaths)
  })
})

module.exports = { readDir }
