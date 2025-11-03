const express = require("express");
const router = express.Router();
const { 
    createUserController, 
    getUsersController,
    changePasswordController,
    adminResetPasswordController
} = require("../controllers/user.controller");

// Import middlewares
const { validateUser } = require('../middleware/validation');
const { verifyToken, hasRole } = require('../middleware/auth');

// Apply validation middleware to POST route
router.post("/", validateUser, createUserController);
router.get("/", getUsersController);

// Change password for current user
router.post('/me/change-password', verifyToken, changePasswordController);

// Admin resets staff password by email
router.post('/reset-password', verifyToken, hasRole('admin'), adminResetPasswordController);

module.exports = router;
