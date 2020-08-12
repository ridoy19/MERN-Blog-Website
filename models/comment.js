const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    commentBody: {
        type: String,
        required: true
    },
    commentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    // upvotedBy: [{
    //     type: String
    // }],
    // downvotedBy: [{
    //     type: String
    // }]
}, { timestamps: true})



module.exports = mongoose.model('Comment', commentSchema)