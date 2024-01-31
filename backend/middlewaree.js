const jwt = require('jsonwebtoken')
const JWT_SECRET  =require( './config')

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.json({
            success:false,
            message:"Please Log In/ Sign up"
        }).status(400)
    }
    const token = authHeader.split(' ')[1]
    try {
        const decode = jwt.verify(token, JWT_SECRET)
           console.log(decode)
        req.userID = decode.userId     
        next()
    } catch (error) {
        console.log(error)
        return res.json({
            success:false,
            mess:"user authentication failed"
        }).status(403)
    }
}

module.exports=  authMiddleware