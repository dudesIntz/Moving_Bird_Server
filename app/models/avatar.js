var fs = require('fs')
var path = require('path')

function bufferImage() {
  return new Promise(resolve => {
    const imgPath = path.join(__dirname, '../../public/download.jpg')
    const base64 = fs.readFileSync(imgPath).toString('base64')
    const img = base64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = new Buffer(img, 'base64')
    resolve(buffer)
  })
}

module.exports = bufferImage
