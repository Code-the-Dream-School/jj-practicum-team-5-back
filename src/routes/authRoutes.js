const express = require('express');
const router = express.Router();

const registerUser = require('../controllers/registerController');
const loginTheUser = require('../controllers/loginController');
const User = require('../models/user');

router.post('/', registerUser);


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
