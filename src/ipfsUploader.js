const abiToJSON = require(`./fileReader`).abiToJSON
const ipfsAPI = require(`ipfs-api`)

const ipfs = new ipfsAPI({
  host: `ipfs.infura.io`,
  port: 5001,
  protocol: `https`
})

const uploadIPFS = program => abiToJSON(program).then(async (files) => {})

module.exports = { uploadIPFS }
