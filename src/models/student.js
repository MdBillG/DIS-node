const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  rollNumber: String,
  class: String,
  assignedTeacher: String,
  dob:String,
  batch:String,
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
