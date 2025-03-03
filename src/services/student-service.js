const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Student = require("../models/student");
const { ObjectId } = require("mongodb");


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
  getStudentbyId:async(id)=>{
    await connectDB();
    try{
      const student = await Student.findOne({_id: new ObjectId(id)})
      if(!student){
        return {success:false,message:"Student not found"}
      }
      return {success:true,data:student}
    }
    catch(error){
      console.error("Error fetching student by email:",error);
      return {success:false,error:error.message}
    }
    finally{
      await mongoose.connection.close();
    }
  },
  deleteStudentbyId:async(id)=>{
    await connectDB();
    try{
      const student = await Student.deleteOne({_id: new ObjectId(id)})
      if(!student){
        return {success:false,message:"Student not found"}
      }
      return {success:true,data:student}
    }
    catch(error){
      console.error("Error deleting student by id:",error);
      return {success:false,error:error.message}
    }
    finally{
      await mongoose.connection.close();
    }
  },
  updateStudentbyId: async(id,updatedData)=>{
    await connectDB();
    try{
      const updatedStudent =await Student.findOneAndUpdate(
        {_id:new ObjectId(id)},
        updatedData,
        {
          new:true,
        }
      );
      if(!updatedStudent){
        return {success:false,message:"Student not found"}
      }
      return {success:true,data:updatedStudent}
    }
      catch(error){
        console.error("Error updating student:",error);
        return {success:false,error:error.message}
      }
      finally{
        await mongoose.connection.close();
      }
  }
};

module.exports = StudentService;