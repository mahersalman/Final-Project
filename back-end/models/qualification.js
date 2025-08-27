const mongoose = require("mongoose");

const qualificationSchema = new mongoose.Schema(
  {
    person_id: String,
    station_name: String,
    avg: Number,
  },
  { collection: "qualification" }
);

module.exports =
  mongoose.models.Qualification ||
  mongoose.model("Qualification", qualificationSchema);
