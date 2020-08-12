const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const signup = async (req, res, next) => {
    try {
        const name = req.body.name
        const password = req.body.password
        const repassword = req.body.repassword
        const email = req.body.email
        const role = req.body.role

        const foundUser = await User.findOne({
            email: email
        })
        if (foundUser) {
            const error = new Error('Email already exists!')
            error.status = 409
            throw error
            //res.status(409).json('Email already exists!')
        } else if (!password || !name || !email || !repassword) {
            const error = new Error(`You must fill the required field!`)
            error.status = 400
            throw error
        } else if (password !== repassword) {
            const error = new Error(`Password dosen't match!`)
            error.status = 422
            throw error
        } 

        const newUser = new User({
            name: name,
            password: await bcrypt.hash(password, 12),
            email: email,
            role: role
        })
        const savedUser = await newUser.save()
        res.status(201).json({
            message: 'User created succesfully!',
            userId: savedUser._id
        })

    } catch (error) {
        next(error)
    }

}


const login = async (req, res, next) => {
    try {
        const email = req.body.email,
            password = req.body.password

        const foundUser = await User.findOne({
            email: email
        })
        if (!email || !password) {
            const error = new Error(`Email or Password field can't be empty!`)
            error.status = 400
            throw error
        } else if (!foundUser) {
            const error = new Error(`Email address is not signed up!`)
            error.status = 401
            throw error
        } else {
            const isEqual = await bcrypt.compare(password, foundUser.password)
            if (!isEqual) {
                const error = new Error(`Wrong password!`)
                error.status = 401
                throw error
            }
            const token = await jwt.sign({
                email: foundUser.email,
                role: foundUser.role,
                name: foundUser.name,
                userId: foundUser._id.toString()
            }, process.env.SECRET, {
                expiresIn: '2h'
            })
            const { _id,name,email,role } = foundUser;
            res.json({
                token: token,
                // userName: foundUser.name,
                // userId: foundUser._id.toString(),
                // role: foundUser.role
                user:{_id,name,email,role}
            })
        }
    } catch (error) {
        next(error)
    }
}




module.exports = {
    signup,
    login
}