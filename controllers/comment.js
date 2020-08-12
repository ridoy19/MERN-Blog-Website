const Comment = require('../models/comment')
const mongoose = require('mongoose')
const Post = require('../models/post')
const User = require('../models/user')

const getAllComments = async (req, res, next) => {
    const postid = req.params.postid
    try {
        if (!mongoose.Types.ObjectId.isValid(postid)) {
            const error = new Error(`Given postid is not valid!`)
            error.status = 422
            throw error
        }

        // const foundPost = await Post.findOne({
        //     _id: postid
        // }).populate({ 
        //     path: 'comments',
        //     populate: {
        //       path: 'comments',
        //       model: 'Comment'
        //     } 
        // })

        const foundPost = await Post.findOne({
            _id: postid
        }).populate({
            path: 'comments',
            populate: {
                path: 'commentBy',
                select: 'name', 
                model: 'User'
            }
        })
        
        if (!foundPost) {
            const err = new Error(`No post found!`)
            err.status = 404
            throw err
        }
        res.json({
            info: foundPost
        })
    } catch (error) {
        next(error)
    }
}


const postComment = async (req, res, next) => {
    const postid = req.params.postid
    try {
        if (!mongoose.Types.ObjectId.isValid(postid)) {
            const error = new Error(`Given postid is not valid!`)
            error.status = 422
            throw error
        }
        const foundPost = await Post.findOne({
            _id: postid
        })
        if (!foundPost) {
            const err = new Error(`No post found!`)
            err.status = 404
            throw err
        }
        // const foundUser = await User.findOne({
        //     _id: req.userData.userId
        // })

        // if (!foundUser) {
        //     const err = new Error(`No user found!`)
        //     err.status = 404
        //     throw err
        // }
        const comment = new Comment({
            commentBody: req.body.commentBody,
            commentBy: req.userData.userId,
            postId: postid
        })
        comment.populate('commentBy', '_id name').execPopulate();
        const saveComment = await comment.save()
        foundPost.comments.push(saveComment)
        await foundPost.save()

        res.json({
            messgae: `Comment posted successfully`,
            info: saveComment
        })
    } catch (error) {
        next(error)
    }
}


const updateComment = async (req, res, next) => {
    const {
        commentid
    } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(commentid)) {
            const error = new Error(`Given commentId is not valid!`)
            error.status = 422
            throw error
        }

        const foundComment = await Comment.findById({
            _id: commentid
        })
        if (!foundComment) {
            const err = new Error(`No comment found!`)
            err.status = 404
            throw err
        }

        if (!foundComment.commentBy.equals(req.userData.userId)) {
            const err = new Error(`Not authorized to peform the action!`)
            err.status = 403
            throw err
        }
        const updatedComemnt = await Comment.findOneAndUpdate({
            _id: commentid
        }, {
            $set: req.body
        }, {
            upsert: true,
            new: true,
            // Available options new: bool - if true, return the modified 
            // document rather than the original. defaults to false
            runValidators: true
        })

        res.json({
            message: `Comment updated successfully`,
            info: updatedComemnt
        })
    } catch (error) {
        next(error)
    }

}


const deleteSingleComment = async (req, res, next) => {
    const {
        commentid,
        postid
    } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(commentid)) {
            const error = new Error(`Given commentId is not valid!`)
            error.status = 422
            throw error
        }

        const foundComment = await Comment.findOne({
            _id: commentid
        })
        if (!foundComment) {
            const err = new Error(`No comment found!`)
            err.status = 404
            throw err
        }

        if (!foundComment.commentBy.equals(req.userData.userId)) {
            const err = new Error(`You are not authorized for the action!`)
            err.status = 403
            throw err
        }

        await Comment.deleteOne({
            _id: commentid
        })

        const foundPost = await Post.findOne({
            _id: postid
        })
        if (!foundPost) {
            const err = new Error(`No post found!`)
            err.status = 404
            throw err
        }
        await foundPost.comments.pull(commentid)
        await foundPost.save()

        res.json({
            message: `Comment deleted successfully!`
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getAllComments,
    postComment,
    updateComment,
    deleteSingleComment
}