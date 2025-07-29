const express = require("express");
const router = express.Router();
const Station = require("../models/Station");
const Product = require("../models/Product");
const WorkingStation = require("../models/WorkingStation");

// Get all stations
router.get("/stations", async (req, res) => {
  try {
    console.log("Attempting to fetch stations...");
    const stations = await Station.find({});
    console.log("Fetched stations:", stations);
    console.log("Number of stations found:", stations.length);
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
    console.log("Attempting to fetch products...");
    const products = await Product.find({}).select("product_name");
    console.log("Fetched products:", products);
    console.log("Number of products found:", products.length);
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
    console.log(`Fetching workstations for station: ${stationName}`);

    const station = await Station.findOne({ station_name: stationName });
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const workstations = await WorkingStation.find({
      station_name: stationName,
    });
    console.log(
      `Found ${workstations.length} workstations for station ${stationName}`
    );

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
