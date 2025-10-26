const Role = require("../models/role");
const { AppError } = require("../utils/errorHandler");

// Only these role names are allowed in the system
const ALLOWED_ROLES = ["admin", "teacher", "student", "principal"];

const getDefaultPermissionsForRole = (roleName) => {
  switch (roleName) {
    case "admin":
      return {
        canLogin: true,
        permissions: {
          roleManagement: { create: true, update: true, delete: true },
          userManagement: { create: true, update: true, deactivate: true },
          announcements: { create: true, read: true, delete: true },
          timetable: { manage: true, view: true },
          student: { create: true, read: true, update: true, delete: true },
          attendance: { mark: true, read: true }
        },
        isSystemRole: true
      };
    case "principal":
      return {
        canLogin: true,
        permissions: {
          roleManagement: { create: false, update: false, delete: false },
          userManagement: { create: true, update: true, deactivate: false },
          announcements: { create: true, read: true, delete: false },
          timetable: { manage: true, view: true },
          student: { create: true, read: true, update: true }
        },
        isSystemRole: false
      };
    case "teacher":
      return {
        canLogin: true,
        permissions: {
          student: { read: true, update: true },
          attendance: { mark: true, read: true },
          grades: { assign: true, read: true }
        },
        isSystemRole: false
      };
    case "student":
      return {
        canLogin: false,
        permissions: {
          student: { read: true },
          timetable: { view: true }
        },
        isSystemRole: false
      };
    default:
      return {};
  }
};

const createRoleService = async (roleData) => {
  try {
    if (!roleData || !roleData.name) {
      throw new AppError(400, "Role name is required");
    }

    const name = String(roleData.name).toLowerCase().trim();

    if (!ALLOWED_ROLES.includes(name)) {
      throw new AppError(400, `Role name must be one of: ${ALLOWED_ROLES.join(", ")}`);
    }

    // Check if role with same name already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      throw new AppError(400, "Role with this name already exists");
    }

    // Build data with defaults for each canonical role
    const defaults = getDefaultPermissionsForRole(name);
    const newRoleData = {
      ...defaults,
      ...roleData,
      name
    };

    // Create new role
    const role = await Role.create(newRoleData);
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
