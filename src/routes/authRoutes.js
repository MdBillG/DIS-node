const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth-controller");

// Login route
router.post("/login", AuthController.login);

// JWT token route
router.post("/generateToken", AuthController.generateToken);

module.exports = router;
