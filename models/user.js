const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        minlength: [5, 'Minimum password length is 5 characters'],
        required: [true, 'User password required'],
    },
    email: {
        type: String,
        validate: {
            validator: email => {
                const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return reg.test(email);
            },
            message: props => `${props.value} is not a valid email address!`
        },
        required: [true, 'User email address required'],
        unique: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, {
    timestamps: true
})


userSchema.pre("updateOne", async (next) => {
    const password = this.getUpdate().$set.password
    if (!password) {
        return next()
    }
    try {
        const hasPass = await bcrypt.hash(password, 12)
        // const salt = bcrypt.genSaltSync();
        // const hash = bcrypt.hashSync(password, 12);
        this.getUpdate().$set.password = hasPass
        next()
    } catch (error) {
        next(error)
    }
});



module.exports = mongoose.model('User', userSchema)