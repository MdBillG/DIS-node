const Batch = require("../models/batch");
const connectDB = require("../config/db");
const mongoose = require("mongoose");
const Student = require("../models/student");
const Staff = require("../models/staff");


const BatchService = {
  createBatch: async (batchData) => {
    await connectDB();
    const { name } = batchData;
    if (!name || typeof name !== "string") {
      return { success: false, error: "Batch name must be a valid string" };
    }
    const existingBatch = await Batch.findOne({ name });
    if (existingBatch) {
      return { success: false, message: "Batch already exists" };
    }
    try {
      const batch = new Batch({ name, students: [], assignedTeacher: null });
      await batch.save();
      return { success: true, batch };
    } catch (error) {
      console.error("Error inserting batch:", error);
      return { success: false, error: error.message };
    } finally {
      await mongoose.connection.close();
    }
  },
  addStudentToBatch: async (batchId, studentId) => {
    await connectDB();
    try {
        const batch = await Batch.findByIdAndUpdate(
            batchId,
            { $addToSet: { students: studentId } }, // Prevent duplicates
            { new: true }
        ).populate("students");

        if (!batch) {
            return { success: false, message: "Batch not found" };
        }

        // 2️⃣ Update the student's batch field
        const student = await Student.findByIdAndUpdate(
            studentId,
            { batch: batchId },
            { new: true }
        );

        return { success: true, message: "Student assigned to batch", batch, student };
   
    } catch (error) {
      console.error("Error adding student to batch:", error);
      return { success: false, error: error.message };
    } finally {
      await mongoose.connection.close();
    }
  },

  // Remove a student from a batch
  removeStudentFromBatch: async (batchId, studentId) => {
    await connectDB();
    try {
        const batch = await Batch.findByIdAndUpdate(
            batchId,
            { $pull: { students: studentId } }, // Remove student from array
            { new: true }
        ).populate("students");

        if (!batch) {
            return { success: false, message: "Batch not found" };
        }

        // 2️⃣ Update the student's batch field to `null`
        const student = await Student.findByIdAndUpdate(
            studentId,
            { batch: null },
            { new: true }
        );
        return { success: true, message: "Student removed from batch", batch, student };
    } catch (error) {
      console.error("Error adding student to batch:", error);
      return { success: false, error: error.message };
    } finally {
      mongoose.connection.close();
    }
  },

  // Assign a teacher to a batch
  assignTeacherToBatch: async (batchId, teacherId) => {
    await connectDB();
    try {
      const batch = await Batch.findById(batchId);
      const teacher = await Staff.findById(teacherId);
      if (!batch || !teacher) throw new Error("Batch or Teacher not found");

      batch.assignedTeacher = teacherId;
      await batch.save();
      return batch;
    } catch (error) {
      console.error("Error assigning teacher to batch:", error);
      return { success: false, error: error.message };
    } finally {
      await mongoose.connection.close();
    }
  },

  // Remove a teacher from a batch
  removeTeacherFromBatch: async (batchId) => {
    await connectDB();
    try {
      const batch = await Batch.findById(batchId);
      if (!batch) throw new Error("Batch not found");
      batch.assignedTeacher = null;
      await batch.save();
      return batch;
    } catch (error) {
      console.error("Error removing teacher from batch:", error);
      return { success: false, error: error.message };
    } finally {
      await mongoose.connection.close();
    }
  },

  getBatchById: async (batchId) => {
    await connectDB();
    try{
        const batch = await Batch.findById(batchId);
        if (!batch) {
            throw new Error("Batch not found");
        }
        return batch;
    }
    catch(error){
        console.error("Error fetching batch by id:", error);
        return { success: false, error: error.message };
    }
    finally{
        await mongoose.connection.close();
    }
},
deleteBatchById: async (batchId) => {
    await connectDB()
    try{
        const deletedBatch = await Batch.findByIdAndDelete(batchId);
        if (!deletedBatch) {
            throw new Error("Batch not found or already deleted");
        }
        return deletedBatch;
    }
    catch(error){
        console.error("Error deleting batch by id:", error);
        return { success: false, error: error.message };
    }
    finally{
        await mongoose.connection.close();
    }
},
getAllBatches: async ({ sort, offset, limit }) => {
    await connectDB()
    try{
        const batches = await Batch.find()
            .sort(sort)
            .skip(offset)
            .limit(limit);
        const totalRecords = await Batch.countDocuments();
        return { success: true, data: batches, totalRecords };
    }
    catch(error){
        console.error("Error fetching all batches:", error);
        return { success: false, error: error.message };
    }
    finally{
        await mongoose.connection.close();
    }
}
   
};

module.exports = BatchService;
