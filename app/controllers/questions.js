const model = require('../models/questions')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const questionAggregation = require('../aggregations/questions')
/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItem = async req => {
  return new Promise((resolve, reject) => {
    const user = new model({
      question: req.question,
      answer: req.answer,
      questionType: req.questionType,
      optionType: req.optionType,
      options: req.options,
      keywords: req.keywords
    })

    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }

      resolve(item.toObject())
    })
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
    res.status(200).json(await db.getItems(req, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getRandomItems = async (req, res) => {
  try {
    console.log(req)
    res
      .status(200)
      .json(await model.aggregate(questionAggregation.getRandomQuestions(10)))
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.getItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.getItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.getQuestionTypes = async (req, res) => {
  try {
    req = matchedData(req)
    res.status(200).json(await model.distinct('keywords'))
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.validateItems = async (req, res) => {
  try {
    req = matchedData(req)
    const _ids = req.questions.map(val => val._id)
    const data = model.find({ _id: _ids })
    req.questions.forEach(val => {
      const db_question = data.find(val => val._id)
      if (db_question.answer === val.answer) {
        val.isCorrectAnswer = true
      }
    })
    res.status(200).json(req.question)
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
    const id = await utils.isIDGood(req.id)
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
    const item = await createItem(req)
    res.status(201).json(item)
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
    console.log(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.deleteItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}
