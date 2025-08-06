const role = require("../models/role");
const { createRoleService ,getRoleById} = require("../services/role.service");
const { AppError } = require('../utils/errorHandler');

/**
 * @desc    Create a new role
 * @route   POST /api/role
 * @access  Private/Admin
 */
const createRoleController = async (req, res, next) => {
    try {
        const result = await createRoleService(req.body);
        
        res.status(201).json({
            success: true,
            message: result.message,
            data: result.data
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all roles
 * @route   GET /api/role
 * @access  Private/Admin
 */
const getRolesController = async (req, res, next) => {
    try {
        const roles = await role.find().select('-__v');
        res.status(200).json({
            success: true,
            count: roles.length,
            data: roles
        });
    } catch (error) {
        next(error);
    }
};

const getRoleByIdController = async (req,res,next)=>{
try{
const role = await getRoleById(req.params.id);
res.status(200).json({
    success: true,
    data: role
})
}
catch(error){
    next(error);
}
}

module.exports = {
    createRoleController,
    getRolesController,
    getRoleByIdController
};