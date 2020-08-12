const Post = require('../models/post')
const mongoose = require('mongoose')
const User = require('../models/user')


const getAllPosts = async (req, res, next) => {
    try {
        const allPosts = await Post.find({}).populate('author', '_id name');
        if (allPosts.length !== 0) {
            res.json({
                allPosts
            })
        } else {
            res.status(204).json(`No post found!`)
        }
        console.log(allPosts)
    } catch (error) {
        next(err)
    }
}


const getPostByUser = async (req, res, next) => {
    try {
        // const userWithPost = await User.findById({
        //     _id: req.params.userId
        // }, '_id name email').populate('posts')
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            const err = new Error(`Provided id is not valid`)
            err.status = 422
            throw err
        }
        const userWithPost = await User.findById({_id: req.params.userId}, '_id name email').populate('posts')
        if (!userWithPost) {
            const err = new Error(`User not found!`)
            err.status = 404
            throw err
        }
        //console.log(req.params.userId)
        //console.log(userWithPost)
        res.json({
            userWithPost
        })
    } catch (error) {
        next(error)
    }
}


const getSinglePost = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.postid)) {
            const err = new Error(`Provided id is not valid`)
            err.status = 422
            throw err
        }
        const foundPost = await Post.findOne({
            _id: req.params.postid
        }).populate({
            path: 'comments',
            populate: {
                path: 'commentBy',
                select: 'name', 
                model: 'User'
            }
        }).populate('author', '_id name');
        //console.log(foundPost);

        if (!foundPost) {
            res.status(404).json({
                message: `No post found!`
            })
        }
        return res.json({
            info: foundPost
        })
    } catch (error) {
        next(error)
    }

}


const savePost = async (req, res, next) => {
    try {
        const title = req.body.title,
            content = req.body.content

        //req.userData.password = undefined
        //console.log(req.userData)
        const newPost = new Post({
            title: title,
            content: content,
            // author: req.userData.userId
            author: req.userId
        })


        //console.log(req.user)
        const savedPost = await newPost.save()
        //console.log(await newPost.save())
        const foundUser = await User.findById({
            // _id: req.userData.userId
            _id: req.userId
        })
        foundUser.posts.push(newPost)
        await foundUser.save()

        res.status(201).json({
            message: `Post created successfully`,
            postId: savedPost._id
        })

    } catch (error) {
        next(error)
    }
}


const updatePost = async (req, res, next) => {
    const postid = req.params.postid
    try {
        if (!mongoose.Types.ObjectId.isValid(postid)) {
            const err = new Error(`Provided id is not valid`)
            err.status = 422
            throw err
        }

        const foundPost = await Post.findOne({
            _id: postid
        })
        // Checking if the logged user is the owner of the post
        if (foundPost.author.toString() !== req.userData.userId) {
            const error = new Error(`Not authorized!`)
            error.status = 403
            throw error
        }
        if (!foundPost) {
            const err = new Error(`No post found for provided id!`)
            err.status = 404
            throw err
        } else {
            await Post.updateOne({
                _id: postid
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
                message: `Post updated successfully`
            })
        }
    } catch (error) {
        next(error)
    }
}


const deleteSinglePost = async (req, res, next) => {
    try {
        const postId = req.params.postid
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            const err = new Error(`Provided id is not valid`)
            err.status = 422
            throw err
        }
        const foundPost = await Post.findById({
            _id: postId
        })
        if (!foundPost) {
            const error = new Error(`No post found for the given id!`)
            error.status = 404
            throw error
        }
        const foundUser = await User.findById({
            _id: req.userData.userId
        })
        // Checking if the logged user is not the owner of the post
        if (!foundPost.author.equals(req.userData.userId)) {
            const err = new Error(`You are not authorized to perform the action!`)
            err.status = 403
            throw err
        }
        const deletedItem = await Post.deleteOne({
            _id: postId
        })

        await foundUser.posts.pull(postId)
        await foundUser.save()

        res.json({
            message: `Post deleted successfully!`
        })
    } catch (error) {
        next(error)
    }
}


// const deleteAllPosts = async (req, res, next) => {
//     try {
//         await Post.deleteMany()
//         res.json({
//             message: `All posts deleted successfully!`
//         })
//     } catch (error) {
//         next(error)
//     }
// }


// Upvote Post
const upvote = async (req, res, next) => {
    const {
        postid
    } = req.params
    const {
        userId,
        name
    } = req.userData
    //console.log(req.userData)
    
    try {
        const foundPost = await Post.findOne({
            _id: postid
        });

        // Checking for post if the post exists
        if (!foundPost) {
            const err = new Error(`No post found with that given post id!`);
            err.status = 404
            throw err
        }
        // Check if the upvoter is the owner himself
        if (foundPost.author.equals(userId)) {
            res.status(403).json({
                success: false,
                message: `You can't like for your own post!`
            })
        } else {
            // Check if the user who liked the post has already liked the blog post before
            if (foundPost.upvotedBy.includes(userId)) {
                const err = new Error(`You already upvoted this post!`)
                err.status = 409
                throw err
            } else {
                // Check if user who liked post has previously disliked a post
                if (foundPost.downvotedBy.includes(userId)) {
                    foundPost.downvotes--; // Reduce the total number of dislikes
                    await foundPost.downvotedBy.pull(userId) // Remove user from array
                    foundPost.upvotes++; // Increment upvotes count
                    foundPost.upvotedBy.push(userId) // Add username to the array of likedBy array
                    const savedPost = await foundPost.save() // Saving the updated post
                    return res.json({
                        success: true,
                        message: `Post upvoted successful!`,
                        info: savedPost
                    })
                } else {
                    foundPost.upvotes++; // Increment upvotes count
                    foundPost.upvotedBy.push(userId) // Add username to the array of likedBy array
                    const savedPost = await foundPost.save() // Saving the updated post
                    return res.json({
                        success: true,
                        message: `Post upvoted successful!`,
                        info: savedPost
                    })
                }
            }
        }

    } catch (error) {
        next(error)
    }
}


const downvote = async (req, res, next) => {
    const { postid } = req.params
    const { userId, name } = req.userData

    try {
        const foundPost = await Post.findById({_id: postid})
        // Checking for post if the post exists
        if (!foundPost) {
            const err = new Error(`No post found with that given post id!`);
            err.status = 404
            throw err
        }
        // Check if the downvoter is the owner himself
        if (foundPost.author.equals(userId)) {
            res.status(403).json({success: false, message: `You can't downvote for your own post!`})
        }else {
            // Check if the user who liked the post has already liked the blog post before
            if (foundPost.downvotedBy.includes(userId)) {
                const err = new Error(`You already downvoted this post!`);
                err.status = 409;
                throw err;
            }else{
                // Check if the user has previously downvoted a post
                if (foundPost.upvotedBy.includes(userId)) {
                    foundPost.upvotes--;
                    await foundPost.upvotedBy.pull(userId);
                    foundPost.downvotes++;
                    foundPost.downvotedBy.push(userId); // Add username to the array of likedBy array
                    const savedPost = await foundPost.save();
                    return res.json({
                        success: true,
                        message: `Post downvoted successful!`,
                        info: savedPost
                    })
                }else {
                    foundPost.downvotes++; // Increment upvotes count
                    foundPost.downvotedBy.push(userId); // Add username to the array of likedBy array
                    const savedPost = await foundPost.save(); // Saving the updated post
                    return res.json({
                        success: true,
                        message: `Post downvoted successful!`,
                        info: savedPost
                    })
                }
            }
        }
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getAllPosts,
    getPostByUser,
    getSinglePost,
    savePost,
    updatePost,
    deleteSinglePost,
    // deleteAllPosts,
    upvote,
    downvote
}


/*

try {
    user = await new Promise( ( resolve, reject ) => {
        User.update( { _id: user.id }, userUpdate, { upsert: true, new: true }, ( error, obj ) => {
            if( error ) {
                console.error( JSON.stringify( error ) );
                return reject( error );
            }

            resolve( obj );
        });
    })
} catch( error ) { .. }

*/