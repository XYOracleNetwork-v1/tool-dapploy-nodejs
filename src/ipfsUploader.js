const ipfsAPI = require(`ipfs-api`)

const ipfs = new ipfsAPI({
  host: `ipfs.infura.io`,
  port: 5001,
  protocol: `https`
})
