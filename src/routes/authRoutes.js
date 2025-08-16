const express = require('express');
const router = express.Router();

const registerUser = require('../controllers/registerController');
const loginTheUser = require('../controllers/loginController');

router.post('/registerUser', registerUser)
router.post('/loginUser', loginTheUser)

module.exports = router
