const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    assignment_id: String,
    date: Date,
    number_of_hours: Number,
    workingStation_name: String,
    person_id: String,
  },
  { collection: "assignment" }
);

module.exports =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
