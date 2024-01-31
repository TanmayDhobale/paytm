
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const { User , Account } = require('../database'); 
const JWT_SECRET = require('../config');


// Signup Validation Schema
const signupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
});


const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});


const signup = async (req, res) => {
    const { success, error } = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Invalid input", error });
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
         const account = await  Account.create({ userId: user._id ,balance: 1000 + Math.random() * 1000000 });
        console.log(account)
        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Error while signing up", error });
    }
};
 
 // Sign-in Route
  const signin = async (req, res) => {
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
};

module.exports= { signin , signup}