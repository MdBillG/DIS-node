const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  rollNumber: String,
  dob:String,
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  assignedTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  dateofadmission:String,
  aadhar: String,
  contactNumber: String,
  fatherName: String,
  motherName: String,
  profilePhoto: Object,
  parentNumber: String,
  address: Object,
});

module.exports = mongoose.model("Student", StudentSchema);
