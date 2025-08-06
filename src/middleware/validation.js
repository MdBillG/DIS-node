const { body, validationResult } = require('express-validator');
const { AppError } = require('../utils/errorHandler');

/**
 * Validation rules for role creation/update
 */
const roleValidationRules = () => {
    return [
        // Name field validation
        body('name')
            .trim()
            .notEmpty().withMessage('Role name is required')
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
            .matches(/^[a-zA-Z0-9\s-]+$/).withMessage('Name can only contain letters, numbers, spaces, and hyphens'),
        
        // Display name field validation
        body('displayName')
            .trim()
            .notEmpty().withMessage('Display name is required')
            .isLength({ min: 2, max: 100 }).withMessage('Display name must be between 2 and 100 characters'),
        
        // Description field validation (optional)
        body('description')
            .optional()
            .trim()
            .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
        
        // Permissions field validation (if needed)
        body('permissions')
            .optional()
            .isArray().withMessage('Permissions must be an array')
    ];
};

/**
 * Middleware to validate the request against the defined rules
 */
const validateRole = (req, res, next) => {
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
        return next();
    }
    
    // Extract error messages
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    
    // Send validation error response
    next(new AppError(400, 'Validation failed', false, extractedErrors));
};

/**
 * Validation rules for user creation/update
 */
const userValidationRules = () => {
    return [
        // Username validation
        body('username')
            .trim()
            .notEmpty().withMessage('Username is required')
            .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
            .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Username can only contain letters, numbers, dots, underscores, and hyphens'),
        
        // Email validation
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please enter a valid email')
            .normalizeEmail(),
        
        // Password validation
        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        
        // Full name validation
        body('fullName')
            .trim()
            .notEmpty().withMessage('Full name is required')
            .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
        
        // Role ID validation
        body('role')
            .notEmpty().withMessage('Role is required')
            .isMongoId().withMessage('Invalid role ID')
    ];
};

// Middleware to validate the request against the defined rules
const validateUser = (req, res, next) => {
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
        return next();
    }
    
    // Extract error messages
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    
    // Send validation error response
    next(new AppError(400, 'Validation failed', false, extractedErrors));
};

module.exports = {
    roleValidationRules,
    validateRole,
    userValidationRules,
    validateUser
};
