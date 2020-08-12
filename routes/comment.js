const express = require('express')
const router = express.Router()
const commentContrller = require('../controllers/comment')
const isAuthenticated = require('../middlewares/isAuth')


router.route('/:postid/comments')
    .get(isAuthenticated, commentContrller.getAllComments)
    .post(isAuthenticated, commentContrller.postComment)


router.route('/:postid/comments/:commentid')
    .patch(isAuthenticated, commentContrller.updateComment)
    .delete(isAuthenticated, commentContrller.deleteSingleComment)


module.exports = router