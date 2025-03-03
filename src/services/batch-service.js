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
      if (!batchId || !teacherId) {
        throw new Error("Batch ID or Teacher ID is missing");
      }
    
      // 1️⃣ Find the batch
      const batch = await Batch.findById(batchId);
      if (!batch) {
        throw new Error("Batch not found");
      }
    
      // 2️⃣ Find the teacher
      const teacher = await Staff.findById(teacherId);
      if (!teacher) {
        throw new Error("Teacher not found");
      }
    
      // 3️⃣ Update batch model
      batch.assignedTeacher = teacherId;
      await batch.save();
    
      // 4️⃣ Update teacher in staff model
      teacher.assignedBatch = batchId;
      await teacher.save();
    
      // 5️⃣ Update all students in the batch
      const studentsUpdated = await Student.updateMany(
        { batch: batchId }, // Find all students in the batch
        { $set: { assignedTeacher: teacherId } } // Assign the teacher
      );
        return { success: true, message: "Teacher assigned successfully", batch, teacher, students: studentsUpdated };
     
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
      if (!batchId) {
        throw new Error("Batch ID is required");
      }
    
      // Find the batch
      const batch = await Batch.findById(batchId);
      if (!batch) {
        throw new Error("Batch not found");
      }
    
      // Check if a teacher is assigned
      const teacherId = batch.assignedTeacher;
      if (!teacherId) {
        throw new Error("No teacher assigned to this batch");
      }
    
      // Remove teacher from batch
      batch.assignedTeacher = null;
      await batch.save();
    
      // Remove teacher's batch reference in staff model
      const teacher = await Staff.findById(teacherId);
      if (teacher) {
        teacher.assignedBatch = null;
        await teacher.save();
      }
    
      // Debug: Check if students exist in batch before removal
      const studentsBefore = await Student.find({ batch: batchId });
    
      // Remove teacher from all students in the batch
      const result = await Student.updateMany(
        { batch: batchId, assignedTeacher: teacherId },  // Ensure match
        { $unset: { assignedTeacher: "" } }  // Remove field properly
      );
    
    
      // Verify by fetching students after update
      const updatedStudents = await Student.find({ batch: batchId });
          return { success: true, message: "Teacher removed successfully", batch, teacher, students: updatedStudents };
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
