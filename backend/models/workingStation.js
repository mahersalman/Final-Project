const mongoose = require("mongoose");

const workingStationSchema = new mongoose.Schema(
  {
    station_name: String,
    workingStation_name: String,
    status: Boolean,
  },
  { collection: "workingStation" }
);

module.exports =
  mongoose.models.WorkingStation ||
  mongoose.model("WorkingStation", workingStationSchema);
