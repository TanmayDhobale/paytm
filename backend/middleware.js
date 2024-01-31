const express = require('express');
const accountModel = require('../backend/routes/account');

const router = express.Router();
const mongoose = require('mongoose');
const zod = require('zod');
const authMiddleware = require('./middlewaree');

// Get account balance
router.post('/getAccountBalance', authMiddleware, async (req, res) => {

    const userID = req.user.userId; // use req.user.userId, not req.body
    const account = await accountModel.findOne({ userID });
    if (!account) {
        return res.status(400).json({
            success: false,
            message: "Account not found"
        });
    }
    return res.status(200).json({
        success: true,
        balance: account.balance 
    });
});

const zodSchema = zod.object({
    amount: zod.number(),
    to: zod.string()
});

// Make transaction using session
router.post('/transferFunds', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { amount, to } = req.body;
    const { success } = zodSchema.safeParse(req.body);
    if (!success) {
        await session.abortTransaction();
        return res.status(400).json({
            success: false,
            message: "Invalid data"
        });
    }

    const myUserID = req.user.userId; // use req.user.userId, assuming JWT decoding stores userID in req.user
    // fetching user details
    const user = await accountModel.findOne({ userID: myUserID }).session(session);
    if (!user) {
        await session.abortTransaction();
        return res.status(400).json({
            success: false,
            message: "Cannot find user details"
        });
    }

    if (user.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            success: false,
            message: "Insufficient balance"
        });
    }

    // account details in which funds will be transferred
    const toAccount = await accountModel.findOne({ userID: to }).session(session);
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            success: false,
            message: "Cannot find target user details"
        });
    }

    user.balance -= amount;
    await user.save();
    toAccount.balance += amount;
    await toAccount.save();

    await session.commitTransaction();
    return res.status(200).json({
        success: true,
        message: "Transfer successful"
    });
});

module.exports = router;
