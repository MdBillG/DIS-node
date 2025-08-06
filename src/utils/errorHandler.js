// Custom Error class for application errors
class AppError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Default error response
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    
    res.status(statusCode).json({
        success: false,
        error: {
            status: statusCode,
            message: message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

// 404 Not Found handler
const notFoundHandler = (req, res, next) => {
    next(new AppError(404, `Not Found - ${req.originalUrl}`));
};

module.exports = {
    AppError,
    errorHandler,
    notFoundHandler
};
