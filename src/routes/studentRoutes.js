const express = require("express");
const StudentController = require("../controllers/studentController");
const AuthMiddleware = require("../config/auth");

const router = express.Router();

router.post("/new", AuthMiddleware.authenticate, StudentController.addStudent);
router.get(
  "/all",
  AuthMiddleware.authenticate,
  StudentController.getAllStudent
);
router.get(
  "/detail/:id",
  AuthMiddleware.authenticate,
  StudentController.fetchStudentbyId
);
router.delete(
  "/delete/:id",
  AuthMiddleware.authenticate,
  StudentController.deleteStudentbyId
);
router.put(
  "/update/:id",
  AuthMiddleware.authenticate,
  StudentController.updateStudentById
);

module.exports = router;
