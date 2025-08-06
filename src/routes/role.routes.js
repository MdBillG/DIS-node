const express = require("express");
const router = express.Router();
const { 
    createRoleController, 
    getRolesController,
    getRoleByIdController,
} = require("../controllers/role.controller");

// Import middlewares
const { validateRole } = require('../middleware/validation');

// Apply validation middleware to POST route
router.post("/", validateRole, createRoleController);
router.get("/", getRolesController);
router.get("/:id", getRoleByIdController);


module.exports = router;
