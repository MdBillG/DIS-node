const express = require("express");
const StaffController = require("../controllers/staffController");

const router = express.Router();

// Create a new staff
router.post("/new", StaffController.addStaff);

// Get all staff members
router.get("/all", StaffController.getAllStaff);

// Get a staff member by email
router.get("/detail/:email", StaffController.getStaff);

// Update a staff member by email
router.put("/update/:email", StaffController.updateStaff);

// Delete a staff member by email
router.delete("/remove/:email", StaffController.deleteStaff);

module.exports = router;
