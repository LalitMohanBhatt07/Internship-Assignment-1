const express = require('express');
const { signUp, signIn, signOut, verifyOTP, fetchUserByEmail } = require('../controllers/userController');
const router = express.Router();


router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/verify-otp', verifyOTP);

router.get('/user/:email', fetchUserByEmail);

module.exports = router;
