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
const { verifyToken, hasRole, hasPermission } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Apply auth middleware to all routes
router.use(verifyToken);
router.use(apiLimiter);

// Apply validation middleware to POST route
router.post("/", 
    hasRole('admin'), 
    hasPermission('roleManagement', 'create'),
    validateRole, 
    createRoleController
);

router.get("/", 
    hasRole('admin', 'principal'), 
    getRolesController
);

router.get("/:id", 
    hasRole('admin', 'principal'),
    getRoleByIdController
);

router.delete("/:id", 
    hasRole('admin'),
    hasPermission('roleManagement', 'delete'),
    deleteRoleByIdController);


module.exports = router;
