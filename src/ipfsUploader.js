const abiFilePaths = require(`./fileReader`).abiFilePaths
const IPFS = require(`ipfs-api`)
const fs = require(`fs`)
const path = require(`path`)

const ipfsParams = {
  host: `ipfs.layerone.co`,
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

const addToIPFS = data => new Promise((resolve, reject) => ipfs.add(data, { recursive: true }, (err, res) => {
  if (err) {
    console.log(`Got IPFS error:`, err)
    reject(err)
  } else {
    res.forEach((fileObj) => {
      if (fileObj.path === folder) {
        console.log(` $ Contracts stored to IPFS`, fileObj.hash)
        console.log(
          ` $ View contracts at https://${ipfsParams.host}/ipfs/${
            fileObj.hash
          }`
        )
        resolve(fileObj.hash)
      }
    })
    reject(
      new Error(
        `No folder returned saving the IPFS file, this shouldn't happen`
      )
    )
  }
}))

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
  .then(addToIPFS)
  .then(pinToIPFS)
  .catch((err) => {
    console.log(err)
  })

module.exports = { uploadIPFS }
