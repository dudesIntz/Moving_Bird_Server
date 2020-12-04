const controller = require('../file-sharing/file-sharing')
const validate = require('../file-sharing/file-sharing-validate')
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
 * Get items route
 */
router.post(
  '/createfolder',
  // requireAuth,
  // AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  validate.createFolder,
  controller.createFolder
)

/*
 * Post upload files
 */

router.post(
  '/upload-file/',
  requireAuth,
  trimRequest.all,
  validate.uploadFile,
  upload.fields([{ name: 'file' }]),
  controller.uploadFile
)

/*
 * Get items route
 */
router.get(
  '/*',
  // requireAuth,
  // AuthController.roleAuthorization(['admin']),
  trimRequest.all,
  controller.listFiles
)
module.exports = router
