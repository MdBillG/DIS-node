const StaffService = require("../services/staff-service");

const StaffController = {
  // Adds a new staff member to the database.
  addStaff: async (req, res) => {
    try {
      const staffData = req.body;
      const result = await StaffService.createStaff(staffData);
      res
        .status(201)
        .json({ message: "Staff added successfully!", data: result });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error adding staff", error: error.message });
    }
  },

  // Retrieves a list of staff members with optional filters: limit, offset, sort, and where conditions.
  getAllStaff: async (req, res) => {
    try {
      const { limit, offset, sort, where } = req.query;

      const parsedLimit = limit ? parseInt(limit, 10) : undefined;
      const parsedOffset = offset ? parseInt(offset, 10) : undefined;
      const parsedSort = sort ? JSON.parse(sort) : {};
      const parsedWhere = where ? JSON.parse(where) : {};

      const result = await StaffService.getAllStaff({
        limit: parsedLimit,
        offset: parsedOffset,
        sort: parsedSort,
        where: parsedWhere,
      });

      res.status(200).json({
        message: "Staff retrieved successfully!",
        totalRecords: result.totalRecords,
        data: result.data,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving staff", error: error.message });
    }
  },

  // Retrieves a specific staff member by email.
  getStaff: async (req, res) => {
    try {
      const { email } = req.params;
      const result = await StaffService.getStaffByEmail(email);
      if (!result.success) {
        return res
          .status(404)
          .json({ message: result.message || "Staff not found" });
      }
      res
        .status(200)
        .json({ message: "Staff retrieved successfully!", data: result.data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving staff", error: error.message });
    }
  },

  // Updates staff details based on the provided email.
  updateStaff: async (req, res) => {
    try {
      const { email } = req.params;
      const updatedData = req.body;
      const result = await StaffService.updateStaffByEmail(email, updatedData);
      if (!result.success) {
        return res
          .status(404)
          .json({ message: result.message || "Staff not found" });
      }
      res
        .status(200)
        .json({ message: "Staff updated successfully!", data: result.data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating staff", error: error.message });
    }
  },

  // Deletes a staff member based on the provided email.
  deleteStaff: async (req, res) => {
    try {
      const { email } = req.params;
      const result = await StaffService.deleteStaffByEmail(email);
      if (!result.success) {
        return res
          .status(404)
          .json({ message: result.message || "Staff not found" });
      }
      res.status(200).json({ message: "Staff deleted successfully!" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting staff", error: error.message });
    }
  },
};

module.exports = StaffController;
