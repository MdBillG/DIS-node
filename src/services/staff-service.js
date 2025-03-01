const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const connectDB = require("../config/db");
const Staff = require("../models/staff");

const StaffService = {
  /**
   * Service to create a new staff member.
   */
  createStaff: async (staffData) => {
    await connectDB(); // Connect to the database
    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(staffData.password, 10); // 10 is the salt rounds
        staffData.password = hashedPassword; // Replace the plain text password with the hashed one

        // Create the new staff member
        const newStaff = await Staff.create(staffData);
        return { success: true, data: newStaff };
    } catch (error) {
        console.error("Error inserting staff:", error);
        return { success: false, error: error.message };
    } finally {
        await mongoose.connection.close(); // Close the connection
    }
},

  /**
   * Service to get all staff members.
   */
  getAllStaff: async ({ limit, offset, sort, where }) => {
    await connectDB();
    try {
      const staffList = await Staff.find(where)
        .sort(sort)
        .skip(offset)
        .limit(limit);

      const totalRecords = await Staff.countDocuments(where);

      return { success: true, totalRecords, data: staffList };
    } catch (error) {
      console.error("Error fetching staff:", error);
      return { success: false, error: error.message };
    } finally {
      await mongoose.connection.close();
    }
  },

  /**
   * Service to get a staff member by email.
   */
  getStaffByEmail: async (email) => {
    await connectDB();
    try {
      const staff = await Staff.findOne({ email });
      if (!staff) {
        return { success: false, message: "Staff not found" };
      }
      return { success: true, data: staff };
    } catch (error) {
      console.error("Error fetching staff by email:", error);
      return { success: false, error: error.message };
    } finally {
      await mongoose.connection.close();
    }
  },

  /**
   * Service to update a staff member by email.
   */
  updateStaffByEmail: async (email, updatedData) => {
    await connectDB();
    try {
      const updatedStaff = await Staff.findOneAndUpdate(
        { email },
        updatedData,
        {
          new: true,
        }
      );
      if (!updatedStaff) {
        return { success: false, message: "Staff not found" };
      }
      return { success: true, data: updatedStaff };
    } catch (error) {
      console.error("Error updating staff:", error);
      return { success: false, error: error.message };
    } finally {
      await mongoose.connection.close();
    }
  },

  /**
   * Service to delete a staff member by email.
   */
  deleteStaffByEmail: async (email) => {
    await connectDB();
    try {
      const deletedStaff = await Staff.findOneAndDelete({ email });
      if (!deletedStaff) {
        return { success: false, message: "Staff not found" };
      }
      return { success: true };
    } catch (error) {
      console.error("Error deleting staff:", error);
      return { success: false, error: error.message };
    } finally {
      await mongoose.connection.close();
    }
  },
};

module.exports = StaffService;
