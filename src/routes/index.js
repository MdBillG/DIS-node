const express = require("express");
const router = express.Router();
const staffRoutes = require("./staffRoutes.js");
const studentRoutes = require("./studentRoutes.js");
const authRoutes = require("./authRoutes.js");
const batchRoutes = require("./batchRoutes.js");

router.use("/staff", staffRoutes);
router.use("/student", studentRoutes);
router.use("/auth", authRoutes);
router.use("/batch",batchRoutes);

module.exports = router;
