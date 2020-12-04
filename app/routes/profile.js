const controller = require('../controllers/profile')
const validate = require('../controllers/profile.validate')
const AuthController = require('../controllers/auth')
const AuthMiddleware = require('../middleware/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')
const role = require('../middleware/role')
const multer = require('multer')
const upload = multer({
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})

/*
 * Profile routes
 */

/*
 * Get profile route
 */
router.get(
  '/',
  requireAuth,
  AuthController.roleAuthorization(role.allUser()),
  trimRequest.all,
  controller.getProfile
)

/*
 * Update profile route
 */
router.patch(
  '/',
  requireAuth,
  AuthController.roleAuthorization(role.allUser()),
  trimRequest.all,
  validate.updateProfile,
  controller.updateProfile
)

/*
 * Get User image of profile
 */

router.get(
  '/avatar/:id',
  validate.verify,
  trimRequest.param,
  controller.getAvatar
)

/*
 * Post User image of profile
 */

router.post(
  '/avatar/',
  requireAuth,
  trimRequest.all,
  upload.single('avatar'),
  controller.uploadAvatar
)

/*
 * Change password route
 */
router.post(
  '/changePassword',
  requireAuth,
  AuthController.roleAuthorization(role.allUser()),
  trimRequest.all,
  validate.changePassword,
  controller.changePassword
)

module.exports = router
