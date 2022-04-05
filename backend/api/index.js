const express = require('express');
const router = express.Router();
const auth = require('./controllers/auth')

router.post('/sign-up', auth.signUp);
router.post('/log-in', auth.logIn);
router.post('/verify-jwt', auth.verifyJWT);

module.exports = router;