const AWS = require('aws-sdk') // from AWS SDK
const readDir = require('./fileReader')

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
            ContentType: 'json',
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
      }),
    )
  })
  return Promise.all(promises)
}

const uploadRemote = program =>
  readDir(program.contractOutput).then(files => {
    const bucketName = `${program.bucketName}/${program.network}`
    console.log(` $ Copying contracts to remote AWS bucket ${bucketName}`)

    const s3 = new AWS.S3({
      signatureVersion: 'v4',
    })
    return uploadFiles(bucketName, s3, files)
  })

module.exports = { uploadRemote }
