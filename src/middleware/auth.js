const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');
const Role = require('../models/role');

/**
 * Verify JWT token middleware
 */
const verifyToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            throw new AppError(401, 'No token provided');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new AppError(401, 'No token provided');
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            throw new AppError(401, 'Invalid or expired token');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Check if user has required role
 * @param {...String} roles - Allowed roles
 */
const hasRole = (...roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                throw new AppError(401, 'Not authenticated');
            }

            const userRole = req.user.role;
            if (!roles.includes(userRole)) {
                throw new AppError(403, 'Not authorized to access this resource');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Check if user has required permission
 * @param {String} module - Module name (e.g., 'student', 'batch')
 * @param {String} operation - Operation name (e.g., 'create', 'read')
 */
const hasPermission = (module, operation) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                throw new AppError(401, 'Not authenticated');
            }

            const role = await Role.findOne({ name: req.user.role });
            if (!role) {
                throw new AppError(403, 'Role not found');
            }

            const hasAccess = role.permissions?.[module]?.[operation];
            if (!hasAccess) {
                throw new AppError(403, 'Not authorized to perform this operation');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = {
    verifyToken,
    hasRole,
    hasPermission
};