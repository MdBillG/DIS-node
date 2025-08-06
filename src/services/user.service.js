const Role = require('../models/role');
const User = require('../models/user');
const { AppError } = require('../utils/errorHandler');

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUserService = async (userData) => {
    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({
            $or: [
                { email: userData.email.toLowerCase() }
            ]
        });

        if (existingUser) {
            throw new AppError(400, 'Email already exists');
        }

        // First get the role to get the role name
        const role = await Role.findById(userData.roleId);
        if (!role) {
            throw new AppError(400, 'Invalid role specified');
        }
        
        // Add roleName to userData
        const userDataWithRole = {
            ...userData,
            roleName: role.name
        };
        
        // Create new user with role name
        const user = await User.create(userDataWithRole);
        
        return {
            success: true,
            data: user,
            message: 'User created successfully'
        };
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            throw new AppError(400, messages.join(', '));
        }
        throw error;
    }
};

/**
 * Get all users with their role details
 * @returns {Promise<Array>} List of users
 */
const getUsersService = async () => {
    try {
        const users = await User.find({})
            .select('-__v -password')
            .populate('role', 'name displayName -_id')
            .lean();
            
        return {
            success: true,
            count: users.length,
            data: users
        };
    } catch (error) {
        throw new AppError(500, 'Error fetching users');
    }
};

module.exports = {
    createUserService,
    getUsersService
};
