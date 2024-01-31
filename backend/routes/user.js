const express = require('express');
const { signin , signup } = require('../controllers/user');
const router = express.Router();

// Sign-up Route
router.post('/signup' , signup);

// Sign-in Route
router.post('/signin' , signin);

module.exports = router;
