const controller = require('../controllers/version-control')
const validate = require('../controllers/version-control.validate')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const multer = require('multer')

const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')
const upload = multer({ storage: controller.storage })

/*
 * Users routes
 */

/*
 * Get items route
 */
router.get('/:id', requireAuth, trimRequest.all, controller.getItems)

/*
 * Get download items route
 */
router.get(
  '/download/:id',
  requireAuth,
  trimRequest.all,
  validate.download,
  controller.downloadItem
)

/*
 * Create new item route
 */
router.post(
  '/',
  requireAuth,
  // AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.AddVersion,
  upload.single('file'),
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
 * add issue item route
 */
router.patch(
  '/add-issue/:id',
  requireAuth,
  // AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.addIssue,
  controller.addIssue
)

/*
 * Update item route
 */
router.patch(
  '/update-issue/:id',
  requireAuth,
  // AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.updateIssue,
  controller.updateIssue
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
