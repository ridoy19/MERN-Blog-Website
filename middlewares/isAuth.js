const jwt = require('jsonwebtoken')
const User = require('../models/user')


module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        const error = new Error('Not authenticated!')
        error.status = 401
        throw error
    }
    const token = authHeader.split(' ')[1];
    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.SECRET)
    } catch (error) {
        next(error)
    }

    //console.log(decodedToken)
    if (!decodedToken) {
        const error = new Error('Not autheticated!')
        error.status = 401
        throw error
    }
    req.userId = decodedToken.userId
    req.userData = decodedToken
    // console.log(req.userId)
    // console.log(req.userData)

    next()
}
// const auth = async (req,res,next) => {
//     try {
//         const authHeader = req.get('Authorization')
//         if (!authHeader) {
//             const error = new Error('Not authenticated!')
//             error.status = 401
//             throw error
//         }
//         const token = authHeader.replace('Bearer', '').trim()

//         const decoded  = jwt.verify(token, process.env.SECRET)

//         const user  = await User.findOne({ _id: decoded._id, 
//             'tokens.token': token})

//         if(!user){
//             throw new Error()
//         }
//         //req.token = token
//         req.user = user
//         console.log(req.user)
//         next()
//     } catch (error) {
//         // console.log(error)
//         // res.status(401).send({error:'Please authenticate!'})
//         next(error)
//     }
// }

// module.exports = auth