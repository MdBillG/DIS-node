const express = require("express");
const StaffController = require("../controllers/staffController");
const AuthMiddleware = require("../config/auth");

const router = express.Router();

// Create a new staff
router.post("/new", AuthMiddleware.authenticate, StaffController.addStaff);

// Get all staff members
router.get("/all", AuthMiddleware.authenticate, StaffController.getAllStaff);

// Get a staff member by email
router.get(
  "/detail/:email",
  AuthMiddleware.authenticate,
  StaffController.getStaff
);

// Update a staff member by email
router.put(
  "/update/:email",
  AuthMiddleware.authenticate,
  StaffController.updateStaff
);

// Delete a staff member by email
router.delete(
  "/remove/:email",
  AuthMiddleware.authenticate,
  StaffController.deleteStaff
);

module.exports = router;
