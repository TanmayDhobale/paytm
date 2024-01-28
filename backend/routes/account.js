const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../database');
const { default: mongoose } = require('mongoose');

const router = express.Router();

// Route to get the balance of the authenticated user
router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.json({ balance: account.balance });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching the balance" });
    }
});

// Route to transfer funds
router.post("/transfer", authMiddleware, async (req, res) => {
    try {
        const result = await transfer(req);
        if (result.success) {
            res.json({ message: "Transfer successful" });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred during the transfer" });
    }
});

// Function to handle transfer of funds between accounts
async function transfer(req) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { amount, to } = req.body;
        const account = await Account.findOne({ userId: req.userId }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return { success: false, message: "Insufficient balance" };
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return { success: false, message: "Invalid recipient account" };
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
        await session.commitTransaction();
        return { success: true };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, message: "An error occurred during the transaction" };
    } finally {
        session.endSession();
    }
}

module.exports = router;
