const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Staff = require("../models/staff");

const createStaff = async (staffData) => {
  await connectDB();
  try {
    const newStaff = await Staff.create(staffData);
    console.log("Staff inserted successfully!");
    return { success: true, data: newStaff };
  } catch (error) {
    console.error("Error inserting staff:", error);
    return { success: false, error: error.message };
  } finally {
    await mongoose.connection.close(); // Disconnects from the DB
    console.log("Database connection closed.");
  }
};

module.exports = { createStaff };
