const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const { User } = require('../database'); // Adjust the path as necessary
const { JWT_SECRET } = require('../config'); // Adjust the path as necessary

const router = express.Router();

// Signup Validation Schema
const signupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
});

// Sign-up Route
router.post('/signup', async (req, res) => {
    const { success, error } = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Invalid input", error: error });
    }

    try {
        let existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let user = new User({ ...req.body, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error while signing up", error });
    }
});

// Signin Validation Schema
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

// Sign-in Route
router.post('/signin', async (req, res) => {
    const { success, data } = signinSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Invalid input format" });
    }

    try {
        const user = await User.findOne({ username: data.username });
        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error while logging in", error });
    }
});

module.exports = router;
