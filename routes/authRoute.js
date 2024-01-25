const express = require('express');
const { registerUser, signInUser} = require('../controllers/authController.js');
const router = express.Router();

router.post('/sign-up', registerUser);

router.post('/sign-in', signInUser);

module.exports = router;
