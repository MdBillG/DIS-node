const express = require("express");
const StudentController = require("../controllers/studentController");

const router= express.Router();

router.post("/new",StudentController.addStudent);
router.get("/all",StudentController.getAllStudent);

module.exports= router;