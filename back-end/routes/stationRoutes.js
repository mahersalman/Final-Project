const express = require("express");
const router = express.Router();
const Station = require("../models/station");
const Product = require("../models/product");
const WorkingStation = require("../models/workingStation");

// Get all stations
router.get("/stations", async (req, res) => {
  try {
    const stations = await Station.find({});
    res.json(stations);
  } catch (error) {
    console.error("Error fetching stations:", error);
    res.status(500).json({
      message: "Error fetching stations",
      error: error.message,
    });
  }
});

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({}).select("product_name");
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
});

// Get working stations for a station
router.get("/workstations/:stationName", async (req, res) => {
  try {
    const { stationName } = req.params;

    const station = await Station.findOne({ station_name: stationName });
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const workstations = await WorkingStation.find({
      station_name: stationName,
    });

    res.json(workstations);
  } catch (error) {
    console.error("Error fetching workstations:", error);
    res.status(500).json({
      message: "Error fetching workstations",
      error: error.message,
    });
  }
});

module.exports = router;
