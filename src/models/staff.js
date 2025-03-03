const mongoose = require("mongoose");
const ROLES = require("../config/role");

const StaffSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password: String,
  phone: String,
  email: String,
  maritalStatus: String,
  address: Object,
  parentsName: String,
  profilePhoto: Object,
  education: Array,
  joiningDate: String,
  role: {
    type: String,
    enum: Object.values(ROLES),
  },
  assignedBatch: String,
  permissions: [String],
});

module.exports = mongoose.model("Staff", StaffSchema);
