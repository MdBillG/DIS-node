const express = require("express");
const router = express.Router();
const staffRoutes = require("./staffRoutes.js");
const studentRoutes = require("./studentRoutes.js");
const authRoutes = require("./authRoutes.js");

router.use("/staff", staffRoutes);
router.use("/student", studentRoutes);
router.use("/auth", authRoutes);

module.exports = router;
