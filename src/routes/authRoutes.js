const express = require('express');
const router = express.Router();

const registerUser = require('../controllers/registerController');
const loginTheUser = require('../controllers/loginController');
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try {
        const { first, last, email, password } = req.body;

        if (!first || !last || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already in use" });


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            first,
            last,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            user: {
                id: newUser._id,
                first: newUser.first,
                last: newUser.last,
                email: newUser.email
            },
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


router.post('/loginUser', loginTheUser);

router.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ exists: true });
        }

        return res.json({ exists: false });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
