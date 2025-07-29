const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Person = require("../models/Person");
const Station = require("../models/Station");
const Assignment = require("../models/Assignment");

// Route for dashboard data
router.get("/dashboard-data", async (req, res) => {
  try {
    console.log("Received request for dashboard data");

    // Calculate active workers (status === 'פעיל')
    const activeWorkers = await Person.countDocuments({ status: "פעיל" });
    console.log("Active workers:", activeWorkers);

    // Calculate total workers and inactive workers
    const totalWorkers = await Person.countDocuments();
    const inactiveWorkers = totalWorkers - activeWorkers;
    console.log("Inactive workers:", inactiveWorkers);

    // Calculate stations
    const totalStations = await Station.countDocuments();
    console.log("Total stations:", totalStations);

    // For active and inactive stations, we'll keep the previous logic
    // Assuming a station is active if it has an assignment today
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const startOfDay = new Date(currentDate);
    const endOfDay = new Date(currentDate);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const activeStations = await Assignment.distinct("workingStation_name", {
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    const activeStationsCount = activeStations.length;
    const inactiveStations = totalStations - activeStationsCount;

    const responseData = {
      inactiveWorkers,
      activeWorkers,
      dailyDefects: 0, // Placeholder as before
      inactiveStations,
    };

    console.log("Sending response:", responseData);
    res.json(responseData);
  } catch (error) {
    console.error("Error calculating dashboard data:", error);
    res.status(500).json({
      message: "Error calculating dashboard data",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Route to get Shluker results
router.get("/shluker-results", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const messages = await mongoose.connection.db
      .collection("mqttMsg")
      .find({
        timestamp: { $gte: today },
      })
      .toArray();

    const counterData = {
      proper: 0,
      improper: 0,
    };

    messages.forEach((msg) => {
      try {
        const parsedMessage = JSON.parse(msg.message);
        if (parsedMessage["Shluker Result"] === "Good Valve") {
          counterData.proper++;
        } else if (parsedMessage["Shluker Result"] === "Invalid Valve") {
          counterData.improper++;
        }
      } catch (parseError) {
        console.error("Error parsing message:", parseError);
      }
    });

    console.log("Shluker results:", counterData);
    res.json(counterData);
  } catch (error) {
    console.error("Error fetching Shluker results:", error);
    res.status(500).json({
      message: "Error fetching Shluker results",
      error: error.message,
    });
  }
});

module.exports = router;
