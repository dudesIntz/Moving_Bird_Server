const fs = require('fs')
const utils = require('../middleware/utils')
const { matchedData } = require('express-validator')
const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const { path: filePath } = req.query
    if (!filePath) {
      cb(new Error('PATH UNDEFINED'))
    }
    dir = path.join(__dirname, '../../documents/', filePath)
    fs.exists(dir, exist => {
      if (!exist) {
        cb('FOLDER NOT EXIST', dir)
      }
      cb(null, dir)
    })
  },

  // By default, multer removes file extensions so let's add them back
  filename(req, file, cb) {
    cb(null, file.originalname)
  }
})

const createFolder = dir => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(`./documents${dir}`)) {
        fs.mkdirSync(`./documents${dir}`)
        resolve({ msg: 'Successfully Created' })
      } else {
        reject(utils.buildErrObject(422, 'FOLDER/FILE ALREADY EXISTS'))
      }
    } catch (err) {
      reject(utils.buildErrObject(422, err.message))
    }
  })
}

const listFiles = url => {
  return new Promise((resolve, reject) => {
    try {
      let arrayOfFiles = fs.readdirSync(`./documents${url}`)
      const path = url.endsWith('/') ? url : `${url}/`
      arrayOfFiles = arrayOfFiles.map(val => {
        const isDirectory = fs
          .lstatSync(`./documents/${path + val}`)
          .isDirectory()
        if (isDirectory) {
          return { dir: val, path }
        }
        return { file: val, path }
      })
      resolve(arrayOfFiles)
    } catch (error) {
      reject(utils.buildErrObject(422, error.message))
    }
  })
}

const checkFileOrDir = path => {
  console.log(path)
  return new Promise((resolve, reject) => {
    // Use stat() method
    fs.stat(`./documents/${path}`, (err, stats) => {
      if (!err) {
        if (stats.isFile()) {
          return resolve(true)
        } else if (stats.isDirectory()) {
          return resolve(false)
        }
      } else {
        reject(utils.buildErrObject(422, 'NO SUCH FILE OR DIRECTORY'))
      }
    })
  })
}

module.exports = {
  storage,
  async listFiles(req, res) {
    try {
      const isFile = await checkFileOrDir(req.url)
      if (!isFile) {
        const files = await listFiles(req.url)
        return res.status(200).json(files)
      }
      res.download(path.join(__dirname, '../../documents', req.url))
    } catch (err) {
      utils.handleError(res, err)
    }
  },
  async createFolder(req, res) {
    try {
      req = matchedData(req)
      const msg = await createFolder(req.folder)
      return res.status(200).json(msg)
    } catch (err) {
      utils.handleError(res, err)
    }
  },

  async uploadFile(req, res) {
    try {
      return res
        .status(200)
        .json(utils.buildSuccObject('successfully uploaded'))

      //  console.log(req.files, req)
    } catch (err) {
      utils.handleError(res, err)
    }
  }
}
