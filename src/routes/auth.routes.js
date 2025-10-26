const express = require('express');
const router = express.Router();
const { loginController } = require('../controllers/auth.controller');
const {
    forgotPasswordController,
    resetPasswordController,
    sendVerificationEmailController,
    verifyEmailController
} = require('../controllers/auth.verification.controller');
const { loginLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const { verifyToken } = require('../middleware/auth');

// Authentication
router.post('/login', loginLimiter, loginController);

// Password Reset
router.post('/forgot-password', passwordResetLimiter, forgotPasswordController);
router.post('/reset-password', passwordResetLimiter, resetPasswordController);

// Email Verification
router.post('/verify/send', verifyToken, sendVerificationEmailController);
router.get('/verify/:token', verifyEmailController);

module.exports = router;