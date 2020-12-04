const model = require('../models/timesheet')
const uuid = require('uuid')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const aggregate = require('../aggregations/timesheet')

const excel = require('./timesheetexport')

/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItem = async req => {
  return new Promise((resolve, reject) => {
    const timesheet = new model({
      task_id: req.task_id,
      task: req.task,
      date: req.date,
      project: req.project,
      taskdetails: req.taskdetails,
      timespend: req.timespend
    })
    timesheet.save((err, item) => {
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
      resolve(removeProperties(item.toObject()))
    })
  })
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res) => {
  try {
    req = matchedData(req)
    await utils.isIDGood(req.task_id)
    const item = await createItem(req)
    res.status(201).json(item)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query)
    query.task_id = req.user._id
    res.status(200).json(await db.getItems(req, model, query))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async (req, res) => {
  try {
    req = matchedData(req)
    await utils.isIDGood(req.id)
    const item = await db.updateItem(req.id, model, req)
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
exports.exportTimesheet = async (req, res) => {
  try {
    req = matchedData(req)
    await utils.isIDGood(req.task_id)

    const query = aggregate.exportTimesheet(req)

    const item = await db.aggregate(query, model)
    //  console.log(item)
    // res.send(item)
    //  res.send(item)
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
