const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Main report route
router.get("/report", async (req, res) => {
  let { date, startDate, endDate, employee, stationId, station } = req.query;
  console.log("Received report request:", {
    date,
    startDate,
    endDate,
    employee,
  });

  try {
    let reportData;
    // If station name provided, try to translate to stationId
    if (!stationId && station) {
      const Station = require("../models/station");
      const stationDoc = await Station.findOne({ station_name: station });
      if (stationDoc && stationDoc.station_id) {
        stationId = stationDoc.station_id;
      }
    }

    if (date || (startDate && endDate)) {
      reportData = await generateRangeReport({
        date,
        startDate,
        endDate,
        employee,
        stationId,
      });
    } else if (employee) {
      reportData = await generateMonthlyEmployeeReport(employee, stationId);
    } else {
      reportData = await generateMonthlyProductionReport(stationId);
    }
    console.log("Report data generated:", reportData);
    res.json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Error generating report" });
  }
});

// Report generation functions
async function generateMonthlyProductionReport(stationId) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  oneMonthAgo.setHours(0, 0, 0, 0);

  const baseQuery = { timestamp: { $gte: oneMonthAgo } };
  if (stationId) baseQuery.station_id = stationId;

  const messages = await mongoose.connection.db
    .collection("mqttMsg")
    .find(baseQuery)
    .toArray();

  const reportData = {};

  messages.forEach((msg) => {
    try {
      const parsedMessage = JSON.parse(msg.message);
      const date = msg.timestamp.toISOString().split("T")[0]; // Get date in YYYY-MM-DD format

      if (!reportData[date]) {
        reportData[date] = { goodValves: 0, invalidValves: 0 };
      }

      if (parsedMessage["Shluker Result"] === "Good Valve") {
        reportData[date].goodValves++;
      } else if (parsedMessage["Shluker Result"] === "Invalid Valve") {
        reportData[date].invalidValves++;
      }
    } catch (parseError) {
      console.error("Error parsing message:", parseError);
    }
  });

  return Object.entries(reportData)
    .map(([date, data]) => ({
      _id: date,
      ...data,
    }))
    .sort((a, b) => a._id.localeCompare(b._id));
}

async function generateMonthlyEmployeeReport(employee, stationId) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  oneMonthAgo.setHours(0, 0, 0, 0);

  const baseQuery = { timestamp: { $gte: oneMonthAgo } };
  if (stationId) baseQuery.station_id = stationId;

  const messages = await mongoose.connection.db
    .collection("mqttMsg")
    .find(baseQuery)
    .toArray();

  const reportData = {};

  messages.forEach((msg) => {
    try {
      const parsedMessage = JSON.parse(msg.message);
      if (parsedMessage["User ID"] === employee) {
        const date = msg.timestamp.toISOString().split("T")[0]; // Get date in YYYY-MM-DD format

        if (!reportData[date]) {
          reportData[date] = { goodValves: 0, invalidValves: 0 };
        }

        if (parsedMessage["Shluker Result"] === "Good Valve") {
          reportData[date].goodValves++;
        } else if (parsedMessage["Shluker Result"] === "Invalid Valve") {
          reportData[date].invalidValves++;
        }
      }
    } catch (parseError) {
      console.error("Error parsing message:", parseError);
    }
  });

  return Object.entries(reportData)
    .map(([date, data]) => ({
      _id: date,
      ...data,
    }))
    .sort((a, b) => a._id.localeCompare(b._id));
}

async function generateRangeReport({
  date,
  startDate,
  endDate,
  employee,
  stationId,
}) {
  let rangeStart;
  let rangeEnd;

  if (date) {
    rangeStart = new Date(date);
    rangeStart.setHours(0, 0, 0, 0);
    rangeEnd = new Date(rangeStart);
    rangeEnd.setDate(rangeEnd.getDate() + 1);
  } else if (startDate && endDate) {
    rangeStart = new Date(startDate);
    rangeStart.setHours(0, 0, 0, 0);
    rangeEnd = new Date(endDate);
    // include end day fully
    rangeEnd.setDate(rangeEnd.getDate() + 1);
    rangeEnd.setHours(0, 0, 0, 0);
  }

  const baseQuery = {
    timestamp: { $gte: rangeStart, $lt: rangeEnd },
  };
  if (stationId) baseQuery.station_id = stationId;

  const messages = await mongoose.connection.db
    .collection("mqttMsg")
    .find(baseQuery)
    .toArray();

  let goodValves = 0;
  let invalidValves = 0;

  messages.forEach((msg) => {
    try {
      const parsedMessage = JSON.parse(msg.message);
      if (employee && parsedMessage["User ID"] !== employee) return;

      if (parsedMessage["Shluker Result"] === "Good Valve") {
        goodValves++;
      } else if (parsedMessage["Shluker Result"] === "Invalid Valve") {
        invalidValves++;
      }
    } catch (parseError) {
      console.error("Error parsing message:", parseError);
    }
  });

  return { goodValves, invalidValves };
}

module.exports = router;
