const AWS = require("aws-sdk"); // from AWS SDK
const fs = require("fs"); // from node.js
const path = require("path"); // from node.js


// resolve full folder path
// const distFolderPath = path.join(__dirname, config.folderPath);

// get of list of files from 'outdir' directory
let readDir = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {

            if(!files || files.length === 0) {
              console.log(`provided folder '${program.output}' is empty or does not exist.`);
              console.log('Make sure your project was compiled!');
              return reject(err);
            }
            // get the full paths of the file
            let filePaths = files.map(fileName => path.join(dir, fileName))
            return resolve(filePaths)
          });
    })
} 

let uploadFiles = (bucketName, s3, files) => {
    let promises = []
    // for each file in the directory
    for (const filePath of files) {      
      let fileName = path.basename(filePath)
      // ignore if directory
      if (fs.lstatSync(filePath).isDirectory()) {
        continue;
      }
      promises.push(new Promise( (resolve, reject) => {
          // read file contents
          fs.readFile(filePath, (error, fileContent) => {
              if( error ) {
                  console.log( error );
                  reject(error)
              }  
              console.log("PUTTING", bucketName)
              // upload file to S3
              s3.putObject({
                  Bucket: bucketName,
                  ACL: 'public-read',
                  Key: fileName,
                  Body: fileContent
              }, (error, res) => {
                  if( error ) {
                      console.log( error );
                      return reject(error)
                  }
                  console.log(`Successfully uploaded '${fileName}'!`);

                  resolve(res)

              });
          })

      }))
  }
  return Promise.all(promises)
}

const uploadRemote = (program) => {
    return readDir(program.output).then((files) => {
        const s3 = new AWS.S3({ 
            signatureVersion: 'v4',
            accessKeyId: program.s3AccessKey,
            secretAccessKey:  program.secretAccessKey
            });
        return uploadFiles(program.bucketName, s3, files)
    })    
}

module.exports = { uploadRemote }

