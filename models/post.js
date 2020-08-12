const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: [120, 'Title can be maximum of 120 characters long']
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    upvotes: {
        type: Number,
        default: 0
    },
    upvotedBy: [{
        type: String
    }],
    downvotes: {
        type: Number,
        default: 0
    },
    downvotedBy: [{
        type: String
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
})



module.exports = mongoose.model('Post', postSchema);