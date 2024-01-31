

const mongoose = require('mongoose');
const { Account } = require('../database');


 const balance =  async (req, res) => {
    console.log(req.userID)
    const account = await Account.findOne({ userId: req.userID });

    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    return res.json({ balance: account.balance });
};


const transfer = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { amount, to } = req.body;

        const account = await Account.findOne({ userId: req.userID }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Recipient account not found" });
        }

        await Account.updateOne({ userId: req.userID }, { $inc: { balance: - amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "An error occurred during the transfer" });
    } finally {
        session.endSession();
    }
};




    module.exports= { transfer , balance}