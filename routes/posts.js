const express = require('express')
const router = express.Router()
const postController = require('../controllers/posts')
const isAutheticated = require('../middlewares/isAuth')

router.route('/')
    .get(postController.getAllPosts)
    
router.route('/:userId?')  
    .get(postController.getPostByUser)

router.route('/compose')
    .post(isAutheticated, postController.savePost)


router.route('/post-details/:postid')
    .get(postController.getSinglePost)
    .put(isAutheticated, postController.updatePost)
    .delete(isAutheticated, postController.deleteSinglePost)


router.route('/:postid/upvotes')
    .put(isAutheticated, postController.upvote)


router.route('/:postid/downvotes')
    .put(isAutheticated, postController.downvote)



module.exports = router