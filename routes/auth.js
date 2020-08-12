const express = require('express')
const router = express.Router()
const User = require('../models/user')
const authController = require('../controllers/auth')



router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)



module.exports = router