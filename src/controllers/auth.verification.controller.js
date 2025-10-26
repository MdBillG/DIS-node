const crypto = require('crypto');
const User = require('../models/user');
const emailService = require('../services/email.service');
const { AppError } = require('../utils/errorHandler');

// Helper function to create random token
const createToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

const forgotPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new AppError(400, 'Please provide your email');
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists
            return res.status(200).json({
                success: true,
                message: 'If your email is registered, you will receive a password reset link'
            });
        }

        // Create reset token
        const resetToken = createToken();
        user.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        try {
            await emailService.sendPasswordResetEmail(user, resetToken);
            res.status(200).json({
                success: true,
                message: 'Password reset link sent to your email'
            });
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            throw new AppError(500, 'Error sending password reset email');
        }
    } catch (error) {
        next(error);
    }
};

const resetPasswordController = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            throw new AppError(400, 'Please provide token and new password');
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new AppError(400, 'Invalid or expired reset token');
        }

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        next(error);
    }
};

const sendVerificationEmailController = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            throw new AppError(404, 'User not found');
        }

        if (user.isEmailVerified) {
            throw new AppError(400, 'Email already verified');
        }

        const verificationToken = createToken();
        user.emailVerificationToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');
        user.emailVerificationExpires = Date.now() + 86400000; // 24 hours
        await user.save();

        try {
            await emailService.sendVerificationEmail(user, verificationToken);
            res.status(200).json({
                success: true,
                message: 'Verification email sent'
            });
        } catch (error) {
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();
            throw new AppError(500, 'Error sending verification email');
        }
    } catch (error) {
        next(error);
    }
};

const verifyEmailController = async (req, res, next) => {
    try {
        const { token } = req.params;
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new AppError(400, 'Invalid or expired verification token');
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    forgotPasswordController,
    resetPasswordController,
    sendVerificationEmailController,
    verifyEmailController
};