const mongoose = require('mongoose');
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
        console.log('Received roleId:', userData.roleId, 'Type:', typeof userData.roleId);
        
        if (!userData.roleId) {
            console.error('No roleId provided in request');
            throw new AppError(400, 'Role ID is required');
        }
        
        // Convert to string and trim any whitespace
        const roleIdStr = String(userData.roleId).trim();
        
        if (!mongoose.Types.ObjectId.isValid(roleIdStr)) {
            console.error('Invalid role ID format. Received:', roleIdStr);
            console.error('Expected format: 24-character hex string, got:', JSON.stringify(roleIdStr));
            throw new AppError(400, `Invalid role ID format. Expected 24-character hex string, got: ${roleIdStr}`);
        }

        const role = await Role.findById(userData.roleId);
        
        if (!role) {
            console.error('Role not found with ID:', userData.roleId);
            const roleCount = await Role.countDocuments();
            console.log(`Total roles in database: ${roleCount}`);
            
            if (roleCount === 0) {
                throw new AppError(400, 'No roles exist in the database. Please create roles first.');
            }
            
            throw new AppError(400, `Role not found with ID: ${userData.roleId}`);
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
            .populate({
                path: 'roleId',
                select: 'name displayName -_id',
                model: 'Role'
            })
            .populate({
                path: 'assignedBatch',
                select: 'name teacher',
                populate: {
                  path: 'teacher',
                  select: 'fullName email roleName'
                }
            })
            .lean();

        // Map the results to maintain backward compatibility with the frontend
        const formattedUsers = users.map(user => ({
            ...user,
            role: user.roleId, // Map roleId to role for backward compatibility
            roleId: user.roleId?._id // Keep the roleId as well if needed
        }));

        return {
            success: true,
            count: formattedUsers.length,
            data: formattedUsers
        };
    } catch (error) {
        console.error('Error in getUsersService:', error);
        throw new AppError(500, 'Error fetching users', false, error);
    }
};

module.exports = {
    createUserService,
    getUsersService
};
