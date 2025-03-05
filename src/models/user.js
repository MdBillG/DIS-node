const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['staff', 'super-admin', 'admin', 'teacher'] }
});

module.exports = mongoose.model("staffs", userSchema);