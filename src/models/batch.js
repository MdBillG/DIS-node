const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema({
name:String,
students:[{type:mongoose.Schema.Types.ObjectId,ref:"Student"}],
assignedTeacher:[{type:mongoose.Schema.Types.ObjectId,ref:"Staff"}],
})

module.exports=mongoose.model("Batch",BatchSchema);