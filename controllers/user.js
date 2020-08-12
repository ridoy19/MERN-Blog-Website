const User = require('../models/user')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const {
    roles
} = require('../roles')


const getAllUser = async (req, res, next) => {
    try {
        const allUser = await User.find({})
        if (allUser.length !== 0) {
            res.json({
                allUser
            })
        } else {
            res.status(204).json(`No users found!`)
        }
    } catch (error) {
        next(error)
    }
}


const getSingleUser = async (req, res, next) => {
    const {
        userId
    } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            const err = new Error(`Provided id is not valid`)
            err.status = 422
            throw err
        }
        const foundUser = await User.findById({
            _id: userId
        })
        if (!foundUser) {
            const err = new Error(`No user found!`)
            err.status = 404
            throw err
        }
        res.json({
            foundUser
        })
    } catch (error) {
        next(error)
    }
}



const deleteSingleUser = async (req, res, next) => {
    const {
        userId
    } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            const err = new Error(`Provided id is not valid`)
            err.status = 422
            throw err
        }
        const foundUser = await User.findById({
            _id: userId
        })
        if (!foundUser) {
            const err = new Error(`No user found!`)
            err.status = 404
            throw err
        }
        await User.deleteOne({_id: userId})
        res.json({
            message: `User deleted successfully!`
        })
    } catch (error) {
        next(error)
    }
}


const deleteAllUser = async (req, res, next) => {
    try {
        await User.deleteMany()
        res.json({
            message: `All users deleted successfully!`
        })
    } catch (error) {
        next(error)
    }
}


// TODO: Make updateProfile works
const updateProfile = async (req, res, next) => {
    const {
        userId
    } = req.userData
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            const err = new Error(`User id is not valid`)
            err.status = 422
            throw err
        }
        // const {
        //     email,
        //     name,
        //     password
        // } = req.body
        // //console.log(`Email: ${email}, Name: ${name}, Password: ${password}`)
        // const changeUser = new User({
        //     name: name,
        //     password: await bcrypt.hash(password, 12),
        //     email: email
        // })
        const updatedUser = await User.updateOne({
            _id: userId
        }, {$set: req.body}, {
            new: true,
            runValidators: true
        })

        res.status(201).json({
            message: 'User updated succesfully!',
            data: updatedUser
        })
    } catch (error) {
        next(error)
    }
}


const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            console.log(req.userData.role)
            const permission = roles.can(req.userData.role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action"
                });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}


const allowIfLoggedin = async (req, res, next) => {
    try {
        const user = req.userData.userId;
        if (!user)
            return res.status(401).json({
                error: "You need to be logged in to access this route"
            });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}



module.exports = {
    getAllUser,
    getSingleUser,
    deleteSingleUser,
    deleteAllUser,
    updateProfile,
    grantAccess,
    allowIfLoggedin
}