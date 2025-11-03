const { createUserService, getUsersService } = require('../services/user.service');
const { AppError } = require('../utils/errorHandler');
const User = require('../models/user');

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Private/Admin
 */
const createUserController = async (req, res, next) => {
    try {
        const result = await createUserService(req.body);
        
        res.status(201).json({
            success: true,
            message: result.message,
            data: result.data
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsersController = async (req, res, next) => {
    try {
        const result = await getUsersService();
        res.status(200).json({
            success: true,
            count: result.count,
            data: result.data
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Change current user's password
 * @route POST /api/users/me/change-password
 * @access Private (authenticated user)
 */
const changePasswordController = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) throw new AppError(401, 'Not authenticated');

        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword || !newPassword || !confirmPassword) {
            throw new AppError(400, 'currentPassword, newPassword and confirmPassword are required');
        }

        if (newPassword !== confirmPassword) {
            throw new AppError(400, 'New password and confirm password do not match');
        }

        if (newPassword.length < 6) {
            throw new AppError(400, 'New password must be at least 6 characters long');
        }

        const user = await User.findById(userId).select('+password');
        if (!user) throw new AppError(404, 'User not found');

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) throw new AppError(401, 'Current password is incorrect');

        user.password = newPassword;
        user.mustChangePassword = false;
        await user.save();

        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUserController,
    getUsersController,
    changePasswordController
};

/**
 * @desc    Admin resets a staff user's password by email
 * @route   POST /api/users/reset-password
 * @access  Private/Admin
 */
const { adminResetPasswordService } = require('../services/user.service');

const adminResetPasswordController = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        if (!email) {
            throw new AppError(400, 'Email is required');
        }

        const result = await adminResetPasswordService(email, newPassword);

        // Return the temporary password so the admin can communicate it to the user.
        // In production you'd typically email this instead of returning it in the API response.
        res.status(result.status || 200).json({
            success: true,
            message: result.message,
            data: result.data
        });
    } catch (error) {
        next(error);
    }
};

module.exports.adminResetPasswordController = adminResetPasswordController;
