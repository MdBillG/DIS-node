const express = require("express");
const router = express.Router();
const { 
    createRoleController, 
    getRolesController,
    getRoleByIdController,
    deleteRoleByIdController,
} = require("../controllers/role.controller");

// Import middlewares
const { validateRole } = require('../middleware/validation');

// Apply validation middleware to POST route
router.post("/", validateRole, createRoleController);
router.get("/", getRolesController);
router.get("/:id", getRoleByIdController);
router.delete("/:id", deleteRoleByIdController);


module.exports = router;
