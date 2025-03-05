const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth-controller");

// Login route
router.post("/login", AuthController.login);

module.exports = router;