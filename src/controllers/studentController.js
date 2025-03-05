const StudentService = require("../services/student-service");

const StudentController = {
addStudent:async(req,res)=>{
    try{
        const studentData =req.body;
        const result = await StudentService.createStudent(studentData);
        res
        .status(201)
        .json({message:"Student added successfully!",data:result});         
    }
    catch(error){
        res
        .status(500)
        .json({message:"Error adding student",error:error.message});
    }
},
getAllStudent:async(req,res)=>{
    try{
        const {limit,offset,sort,where} = req.query;

        const parsedLimit = limit ? parseInt(limit,10) : undefined;
        const parsedOffset = offset ? parseInt(offset,10) : undefined;
        const parsedSort = sort ? JSON.parse(sort) : {};
        const parsedWhere = where ? JSON.parse(where) : {};

        const result = await StudentService.getStudents({
            limit:parsedLimit,
            offset:parsedOffset,
            sort:parsedSort,
            where:parsedWhere,
        });

        res.status(200).json({
            message:"Student retrieved successfully!",
            totalRecords:result.totalRecords,
            data:result.data,
        });
    }catch(error){
        res
        .status(500)
        .json({message:"Error retrieving student",error:error.message});
    }
},
fetchStudentbyId: async(req,res)=>{
    try{
        const {id} = req.params;
        const result = await StudentService.getStudentbyId(id);
        if(!result.success){
            return res
            .status(404)
            .json({message:result.message || "Student not found"});
        }
        res
        .status(200)
        .json({message:"Student retrieved successfully!",data:result.data});
    }
    catch(error){
        res
        .status(500)
        .json({message:"Error retrieving student",error:error.message});
    }
},
deleteStudentbyId:async(req,res)=>{
    try{
        const {id} = req.params;
        const result = await StudentService.deleteStudentbyId(id);
        if(!result.success){
            return res
            .status(404)
            .json({message:result.message || "Student not found"});
        }
        res
        .status(200)
        .json({message:"Student deleted successfully!",data:result.data});
    }
    catch(error){
        res
        .status(500)
        .json({message:"Error deleting student",error:error.message});
    }
},
updateStudentById:async(req,res)=>{
    try{
        const {id} = req.params;
        const studentData = req.body;
        const result = await StudentService.updateStudentbyId(id,studentData);
        if(!result.success){
            return res
            .status(404)
            .json({message:result.message || "Student not found"});
        }
        res
        .status(200)
        .json({message:"Student updated successfully!",data:result.data});
    }
    catch(error){
        res
        .status(500)
        .json({message:"Error updating student",error:error.message});
    }
}

}

module.exports = StudentController;