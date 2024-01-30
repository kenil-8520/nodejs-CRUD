const express = require('express');
const { registerUser, signInUser, changePassword, forgotpassword, resetPassword} = require('../controllers/authController.js');
const verifyToken = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/sign-up', registerUser);

router.post('/sign-in', signInUser);

router.post('/change-password', verifyToken, changePassword);

router.post('/forgot-password', forgotpassword )

router.post('/reset-password', resetPassword )

module.exports = router;
