const { createUserService, getUsersService } = require('../services/user.service');
const { AppError } = require('../utils/errorHandler');

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

module.exports = {
    createUserController,
    getUsersController
};
