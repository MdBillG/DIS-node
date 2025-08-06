const { isNamedExportBindings } = require("typescript");
const Role = require("../models/role");
const { AppError } = require("../utils/errorHandler");

const createRoleService = async (roleData) => {
  try {
    // Check if role with same name already exists
    const existingRole = await Role.findOne({
      name: roleData.name.toLowerCase(),
    });
    if (existingRole) {
      throw new AppError(400, "Role with this name already exists");
    }

    // Create new role
    const role = await Role.create(roleData);
    return {
      success: true,
      status: 201,
      message: "Role created successfully",
      data: role,
    };
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      throw new AppError(400, messages.join(", "));
    }
    throw error;
  }
};

const getRoleById = async (roleId) => {
  try {
    const role = await Role.find({ _id: roleId });
    return {
      success: true,
      status: 200,
      message: "Role fetched successfully",
      data: role,
    };
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      throw new AppError(400, messages.join(", "));
    }
    throw error;
  }
};

const deleteRoleByIdService = async (roleId) => {
  try {
    if (!roleId) {
      throw new AppError(400, "Role ID is required");
    }

    const role = await Role.findByIdAndDelete(roleId);
    return {
      success: true,
      status: 200,
      message: "Role deleted successfully",
      data: role,
    };
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createRoleService,
  getRoleById,
  deleteRoleByIdService,
};
