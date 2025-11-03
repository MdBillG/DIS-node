const User = require('../models/user');
const Role = require('../models/role');
const { AppError } = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email and password provided
        if (!email || !password) {
            throw new AppError(400, 'Please provide email and password');
        }

        // Find user and include role
        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.comparePassword(password))) {
            throw new AppError(401, 'Invalid credentials');
        }

        // Check if user's role allows login
        const role = await Role.findById(user.roleId);
        console.log(role,'role')
        // if (!role?.canLogin) {
        //     throw new AppError(403, 'Your account type is not permitted to login');
        // }

        // Check if user is active
        if (!user.isActive) {
            throw new AppError(403, 'Your account has been deactivated');
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create token
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                role: user.roleName
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.roleName,
                    mustChangePassword: user.mustChangePassword || false
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginController
};