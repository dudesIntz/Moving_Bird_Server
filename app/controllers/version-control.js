const model = require('../models/version-control')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
var AdmZip = require('adm-zip')

const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const aggregate = require('../aggregations/timesheet')
const { ObjectID } = require('mongodb')
const multer = require('multer')

const excel = require('./timesheetexport')

/*********************
 * Private functions *
 *********************/

const storage = multer.diskStorage({
  destination(req, file, cb) {
    dir = path.join(__dirname, '../../versions/')
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    cb(null, dir)
  },
  filename(req, file, cb) {
    const filename = req.query.projectname || 'test'
    const filedestionation = `${filename}-${Date.now()}.zip`
    if (!file.originalname.match(/\.(zip)$/)) {
      return cb(new Error('Please upload an ZIP file'))
    }
    req.filedestionation = filedestionation
    cb(null, filedestionation)
  }
})

const addVersion = req => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await model
        .find({ project_id: req.project_id })
        .sort({ _id: -1 })
        .limit(1)
      let version = data.length ? data[0].version || '1.0.0' : '1.0.0'
      version = version.split('.')
      if (req.version === 'major') {
        version[0] = Number(version[0]) + 1
      } else if (req.version === 'features') {
        version[1] = Number(version[1]) + 1
      } else if (req.version === 'fixes') {
        version[2] = Number(version[2]) + 1
      }
      resolve(version.join('.'))
    } catch (err) {
      reject(utils.buildErrObject(422, 'ERROR IN ADDING VERSION'))
    }
  })
}

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItem = req => {
  return new Promise(async (resolve, reject) => {
    try {
      const version = await addVersion(req)
      console.log(`${__dirname}/../../versions/${req.filedestionation}`)
      const zip = await new AdmZip(
        path.join(`${__dirname}/../../versions/${req.filedestionation}`)
      )

      const zipEntries = await zip.getEntries()
      const versionModel = new model({
        version,
        project_id: req.project_id,
        path: req.filedestionation,
        description: req.description,
        uploadedby: req.uploadedby,
        filescount: zipEntries.length
      })
      versionModel.save((err, item) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message))
        }
        // Removes properties with rest operator
        const removeProperties = ({
          // eslint-disable-next-line no-unused-vars
          // eslint-disable-next-line no-unused-vars
          __v,
          ...rest
        }) => rest
        resolve(item)
      })
    } catch (err) {
      reject(utils.buildErrObject(422, err.message))
    }
  })
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res) => {
  try {
    const filedestionation = req.filedestionation
    req = matchedData(req)
    req.filedestionation = filedestionation
    await utils.isIDGood(req.project_id)
    const item = await createItem(req)
    res.status(201).json(item)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * storage function export  called by route
 */

exports.storage = storage

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {
  try {
    const data = await model
      .find({ project_id: req.params.id })
      .sort({ _id: -1 })
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.addIssue = async (req, res) => {
  try {
    req = matchedData(req)
    await utils.isIDGood(req.id)
    await utils.isIDGood(req.issuedBy)
    const _id = req.id
    delete req.id
    const item = await model.updateOne(
      { _id },
      {
        $push: {
          issues: { $each: [{ ...req, _id: ObjectID() }], $position: 0 }
        }
      }
    )
    res.status(200).json(item)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateIssue = async (req, res) => {
  try {
    req = matchedData(req)
    await utils.isIDGood(req.id)
    await utils.isIDGood(req._id)
    const version_id = req.id
    req._id = new ObjectID(req._id)
    delete req.id
    const item = await model.updateOne(
      { _id: version_id, 'issues._id': req._id },
      { $set: { 'issues.$': req } }
    )
    res.status(200).json(item)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * download item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.downloadItem = async (req, res) => {
  try {
    req = matchedData(req)
    await utils.isIDGood(req.id)
    const file = path.join(__dirname, '../../versions', req.path)
    fs.exists(file, exist => {
      if (!exist) {
        utils.handleError(res, utils.buildErrObject(422, 'File Not Exist'))
      }
      res.download(file)
    })
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.exportTimesheet = async (req, res) => {
  try {
    req = matchedData(req)
    await utils.isIDGood(req.task_id)

    const query = aggregate.exportTimesheet(req)

    const item = await db.aggregate(query, model)
    await excel(res, item)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getChart = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    const query = aggregate.getChart(id) // get current month chart
    res.status(200).json(await db.aggregate(query, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.deleteItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}
