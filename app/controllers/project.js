const model = require('../models/project')
const uuid = require('uuid')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const mongoose = require('mongoose')

const list = ['Holiday', 'Leave', 'Sample', 'Learning']
/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItem = async req => {
  console.log(req)
  return new Promise((resolve, reject) => {
    const project = new model({
      projectName: req.projectName,
      members: req.members,
      client: req.client,
      role: req.role,
      owner: req.owner
    })

    project.save((err, item) => {
      console.log(err, item)
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }

      resolve(item.toObject())
    })
  })
}

const projectExists = async projectName => {
  return new Promise((resolve, reject) => {
    model.findOne(
      {
        projectName
      },
      (err, item) => {
        utils.itemAlreadyExists(err, item, reject, 'PROJECT_ALREADY_EXISTS')
        resolve(false)
      }
    )
  })
}

/********************
 * Public functions *
 ********************/

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query)
    res.status(200).json(await db.getItems(req, model, query))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get Today birth day items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getBirthdayItems = async (req, res) => {
  try {
    res
      .status(200)
      .json(await db.aggregate(aggregate.birthdayAggregation(), model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get current month birth day items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getCurrentMonthBirthdayItems = async (req, res) => {
  try {
    res
      .status(200)
      .json(await db.aggregate(aggregate.currentMonthBirthDay(), model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.getItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getProjectList = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    const query = { 'members._id': mongoose.Types.ObjectId(id) }
    const item = await db.find(query, model)
    const projectList = [...list, ...item.map(val => val.projectName)]
    res.status(200).json(projectList)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req._id)
    res.status(200).json(await db.updateItem(id, model, req))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res) => {
  try {
    req = matchedData(req)

    const isProjectExists = await projectExists(req.projectName)
    if (!isProjectExists) {
      const item = await createItem(req)
      res.status(201).json(item)
    }
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
