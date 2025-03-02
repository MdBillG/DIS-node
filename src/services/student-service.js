const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Student = require("../models/student");

const StudentService = {
  createStudent: async (studentData) => {
    await connectDB();
    try {
      const newStudent = await Student.create(studentData);
      return { success: true, data: newStudent };
    } catch (error) {
      console.error("Error inserting staff:", error);
      return { success: false, error: error.message };
    } finally {
      await mongoose.connection.close();
    }
  },
  getStudents: async () => {
    await connectDB();
    try {
      const students = await Student.find();
      return { success: true, data: students };
    } catch (error) {
      console.error("Error getting students:", error);
      return { success: false, error: error.message };
    } finally {
      await mongoose.connection.close();
    }
  },
};

module.exports = StudentService;