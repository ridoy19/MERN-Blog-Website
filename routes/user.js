const express = require('express')
const router = express.Router()
const User = require('../models/user')
const userController = require('../controllers/user')
const isAuthenticated = require('../middlewares/isAuth')



router.route('/all-users')
    .get(isAuthenticated,
        userController.grantAccess('readAny', 'profile'),
        userController.getAllUser)
    .delete(isAuthenticated,
        userController.grantAccess('deleteAny', 'profile'),
        userController.deleteAllUser)


router.route('/:userId/profile')
    .get(isAuthenticated,
        userController.grantAccess('readOwn', 'profile'),
        userController.getSingleUser)



router.route('/:edit?/profile')
    .patch(isAuthenticated,
        userController.grantAccess('updateOwn', 'profile'),
        userController.updateProfile)
    


router.route('/users/:userId')
    .delete(isAuthenticated,
        userController.grantAccess('deleteAny', 'profile'),
        userController.deleteSingleUser)

        

module.exports = router