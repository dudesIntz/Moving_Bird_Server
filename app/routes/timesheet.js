const controller = require('../controllers/timesheet')
const validate = require('../controllers/timesheet.validate')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

/*
 * Users routes
 */

/*
 * Get items route
 */
router.get('/', requireAuth, trimRequest.all, controller.getItems)

/*
 * Create new item route
 */
router.post(
  '/',
  requireAuth,
  // AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.Timesheet,
  controller.createItem
)

/*
 * Get item route
 */
// router.get(
//   '/:id',
//   requireAuth,
//   AuthController.roleAuthorization(['admin']),
//   trimRequest.all,
//   validate.getItem,
//   controller.getItem
// )

/*
 * Update item route
 */
router.patch(
  '/:id',
  requireAuth,
  // AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.updateItem,
  controller.updateItem
)

/*
 * get excel item route
 */
router.get(
  '/excel',
  requireAuth,
  // AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.exportExcel,
  controller.exportTimesheet
)

/*
 * get excel item route
 */
router.get(
  '/chart/:id',
  requireAuth,
  // AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.getChart,
  controller.getChart
)

/*
 * Delete item route
 */
router.delete(
  '/:id',
  requireAuth,
  // AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.deleteItem,
  controller.deleteItem
)

module.exports = router
