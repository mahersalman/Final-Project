const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    station_id: String,
    station_name: String,
    department: String,
    product_name: String,
  },
  { collection: "station" }
);

module.exports =
  mongoose.models.Station || mongoose.model("Station", stationSchema);
