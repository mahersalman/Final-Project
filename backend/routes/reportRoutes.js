const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Main report route
router.get("/report", async (req, res) => {
  const { date, employee } = req.query;
  console.log("Received report request:", { date, employee });

  try {
    let reportData;
    if (date) {
      reportData = await generateDailyReport(date, employee);
    } else if (employee) {
      reportData = await generateMonthlyEmployeeReport(employee);
    } else {
      reportData = await generateMonthlyProductionReport();
    }
    console.log("Report data generated:", reportData);
    res.json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Error generating report" });
  }
});

// Report generation functions
async function generateMonthlyProductionReport() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  oneMonthAgo.setHours(0, 0, 0, 0);

  const messages = await mongoose.connection.db
    .collection("mqttMsg")
    .find({
      timestamp: { $gte: oneMonthAgo },
    })
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

async function generateMonthlyEmployeeReport(employee) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  oneMonthAgo.setHours(0, 0, 0, 0);

  const messages = await mongoose.connection.db
    .collection("mqttMsg")
    .find({
      timestamp: { $gte: oneMonthAgo },
    })
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

async function generateDailyReport(date, employee) {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  let query = {
    timestamp: { $gte: startDate, $lt: endDate },
  };

  let messages = await mongoose.connection.db
    .collection("mqttMsg")
    .find(query)
    .toArray();

  let goodValves = 0;
  let invalidValves = 0;

  messages.forEach((msg) => {
    try {
      const parsedMessage = JSON.parse(msg.message);

      if (employee && parsedMessage["User ID"] !== employee) {
        return; // Skip this message if it's not for the specified employee
      }

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
