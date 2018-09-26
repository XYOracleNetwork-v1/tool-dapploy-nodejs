const abiFilePaths = require(`./fileReader`).abiFilePaths
const IPFS = require(`ipfs-api`)
const fs = require(`fs`)
const path = require(`path`)

const ipfs = new IPFS({
  host: `ipfs.xyo.network`,
  port: 5002,
  protocol: `https`
})

const folder = `contracts`

const uploadIPFS = program => abiFilePaths(program)
  .then((files) => {
    const data = []
    files.forEach((filePath) => {
      const content = fs.readFileSync(filePath)
      const ipfsPath = `${folder}/${path.basename(filePath)}`
      data.push({ path: ipfsPath, content })
    })
    return data
  })
  .then(
    data => new Promise((resolve, reject) => ipfs.add(data, { recursive: true }, (err, res) => {
      if (err) {
        console.log(`Got IPFS error:`, err)
        reject(err)
      } else {
        res.forEach((fileObj) => {
          if (fileObj.path === folder) {
            console.log(` $ Contracts stored to IPFS`, fileObj.hash)
            resolve(fileObj)
          }
        })
        reject(
          new Error(
            `No folder returned saving the IPFS file, this shouldn't happen`
          )
        )
      }
    }))
  )

module.exports = { uploadIPFS }
