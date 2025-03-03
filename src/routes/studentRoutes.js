const express = require("express");
const StudentController = require("../controllers/studentController");

const router= express.Router();

router.post("/new",StudentController.addStudent);
router.get("/all",StudentController.getAllStudent);
router.get("/detail/:id",StudentController.fetchStudentbyId);
router.delete('/delete/:id',StudentController.deleteStudentbyId);
router.put('/update/:id',StudentController.updateStudentById);

module.exports= router;