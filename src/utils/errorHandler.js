// Custom Error class for application errors
class AppError extends Error {
    constructor(statusCode, message, isOperational = true, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    // Log the error with request details
    console.error('\n--- ERROR ---');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Request:', {
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: req.query,
        body: req.body
    });
    console.error('Error:', {
        name: err.name,
        message: err.message,
        code: err.code,
        stack: err.stack
    });
    
    // Default error response
    const statusCode = err.statusCode || 500;
    const response = {
        success: false,
        error: {
            status: statusCode,
            name: err.name,
            message: err.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && { 
                stack: err.stack,
                details: err
            })
        }
    };
    
    // Handle MongoDB specific errors
    if (err.name === 'MongoServerError') {
        // Duplicate key error (E11000)
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            response.error.message = `${field} already exists`;
            response.error.field = field;
            response.error.value = err.keyValue[field];
            response.error.code = 'DUPLICATE_KEY';
        }
        // Validation errors
        else if (err.code === 121) {
            response.error.message = 'Database validation failed';
            response.error.code = 'VALIDATION_ERROR';
        }
    }
    // Handle validation errors
    else if (err.name === 'ValidationError') {
        const errors = [];
        for (let field in err.errors) {
            errors.push({
                field: field,
                message: err.errors[field].message,
                value: err.errors[field].value
            });
        }
        response.error.errors = errors;
        response.error.code = 'VALIDATION_ERROR';
    }
    
    res.status(statusCode).json(response);
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
