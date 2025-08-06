const express = require("express");
const router = express.Router();
const { 
    createUserController, 
    getUsersController 
} = require("../controllers/user.controller");

// Import middlewares
const { validateUser } = require('../middleware/validation');

// Apply validation middleware to POST route
router.post("/", validateUser, createUserController);
router.get("/", getUsersController);

module.exports = router;
