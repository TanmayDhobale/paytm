const express= require('express')
const accountModel = require('../accountModel')
const userModel = require('../db')
const router = express.Router()
const mongoose = require('mongoose')
const zod = require('zod')
const authMiddleware = require('../middleware')
// Get account balance
router.post('/getAccountBalance',authMiddleware,async(req,res)=>{
    const { userID } = req.body
    const account = await accountModel.findOne({userID})
    if(!account){
        return res.json({
            success:false,
            message:"Something went wrong"
        }).status(400)
    }
    return res.json({
        success:true,
        account
    }).status(200)
})

const zodSchema = zod.object({
    amount:zod.number(),
    to:zod.string()
})

//Make transcation using session
router.post('/transferFunds',authMiddleware,async(req,res)=>{
const session = await mongoose.startSession()
session.startTransaction()
    
const { amount , to  }= req.body    
const { success }  = zodSchema.safeParse(req.body )
if(!success){
    session.abortTransaction()
    return res.json({
        success:false,
        message:"Invalid data"
    }).status(400)
}
const myuserID = req.userID
// fetching user details
const user = await accountModel.findOne({userID:myuserID}).session(session)
if(!user){
    await session.abortTransaction()
    return res.json({
        success:false,
        message:"Cannot find user details"
    }).status(400)
}
if(user.balance < amount){
    await  session.abortTransaction()
    return res.json({
        success:false,
        message:"Insufficient balance"
    })
}

// account details in which funds will be transferred
const toAccount  = await accountModel.findOne({userID:to}).session(session)
if(!toAccount){
    session.abortTransaction();
    res.json({
        success:false,
        message:"Cannot find user* details"
    }).status(400)
}
 
user.balance = user.balance - amount
await user.save()
toAccount.balance = amount + toAccount.balance 
await toAccount.save()

await session.commitTransaction();
res.json({
    success:true,
    message:"Transfer successfull"
}).status(200)

})

module.exports = router