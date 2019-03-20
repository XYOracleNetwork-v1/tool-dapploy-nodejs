const abiFilePaths = require(`./fileReader`).abiFilePaths
const IPFS = require(`ipfs-http-client`)
const fs = require(`fs`)
const path = require(`path`)

const ipfsParams = {
  host: `ipfs.xyo.network`,
  port: 5002,
  protocol: `https`
}
const ipfs = new IPFS(ipfsParams)

const folder = `contracts`

const pinToIPFS = hash => new Promise((resolve, reject) => {
  ipfs.pin.add(hash, (err, res) => {
    if (err) {
      reject(err)
    } else {
      console.log(` $ Contracts pinned on IPFS`)
      resolve(res)
    }
  })
})

const addToIPFS = data => new Promise((resolve, reject) => ipfs.add(data, { wrapWithDirectory: false }, (err, res) => {
  if (err) {
    console.log(`Got IPFS error:`, err)
    reject(err)
  } else {
    res.forEach((fileObj) => {
      if (!fileObj.path.includes(`Mock`)) {
        console.log(`${fileObj.path}: ${fileObj.hash}`)
      }
    })
  }
}))

const uploadIPFS = program => abiFilePaths(program)
  .then((files) => {
    const promises = []
    files.forEach((filePath) => {
      const content = fs.readFileSync(filePath)
      // const ipfsPath = `/${folder}/${path.basename(filePath)}`
      promises.push(addToIPFS({ path: path.basename(filePath), content }))
    })

    return Promise.all(promises)
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = { uploadIPFS }
