const AWS = require('aws-sdk') // from AWS SDK
const fs = require('fs') // from node.js
const path = require('path') // from node.js

// resolve full folder path
// const distFolderPath = path.join(__dirname, config.folderPath);

// get of list of files from 'outdir' directory
const readDir = dir =>
  new Promise((resolve, reject) => {
    const resolvePath = dir
    fs.readdir(resolvePath, (err, files) => {
      if (!files || files.length === 0) {
        console.log(
          `provided folder '${resolvePath}' is empty or does not exist.`
        )
        console.log('Make sure your project was compiled!')
        return reject(err)
      }
      // get the full paths of the file
      const filePaths = files.map(fileName => path.join(resolvePath, fileName))
      return resolve(filePaths)
    })
  })

const uploadFiles = (bucketName, s3, files) => {
  const promises = []
  // for each file in the directory
  files.forEach(filePath => {
    const fileName = path.basename(filePath)
    // ignore if directory
    if (fs.lstatSync(filePath).isDirectory()) {
      return
    }

    promises.push(
      new Promise((resolve, reject) => {
        // read file contents
        fs.readFile(filePath, (error, fileContent) => {
          if (error) {
            reject(error)
          }
          const params = {
            Bucket: bucketName,
            ACL: 'bucket-owner-full-control',
            Key: fileName,
            Body: fileContent,
            ContentType: 'json'
          }
          // upload file to S3
          s3.putObject(params, (err, res) => {
            if (err) {
              return reject(err)
            }
            console.log(`Successfully uploaded '${fileName}'!`)

            return resolve(res)
          })
        })
      })
    )
  })
  return Promise.all(promises)
}

const uploadRemote = program =>
  readDir(program.contractOutput).then(files => {
    const bucketName = `${program.bucketName}/${program.network}`
    console.log(` $ Copying contracts to remote AWS bucket ${bucketName}`)

    const s3 = new AWS.S3({
      signatureVersion: 'v4'
    })
    return uploadFiles(bucketName, s3, files)
  })

module.exports = { uploadRemote }
