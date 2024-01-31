const express = require('express');
const authMiddleware = require('../middlewaree');
const {balance , transfer} = require("../controllers/account")

const router = express.Router();

 router.get("/balance", authMiddleware, balance )

router.post("/transfer", authMiddleware, transfer )
module.exports = router;
