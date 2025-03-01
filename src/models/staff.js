const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password:String,
  phone: String,
  email: String,
  maritalStatus: String,
  address: Object,
  parentsName: String,
  profilePhoto: Object,
  education: Array,
  joiningDate: String,
  role: String,
  assignedBatch: String,
  permissions: [String],
});

module.exports = mongoose.model("Staff", StaffSchema);
