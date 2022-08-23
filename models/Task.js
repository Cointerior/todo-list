const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TaskSchema = new Schema({
  task: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model("Task", TaskSchema)