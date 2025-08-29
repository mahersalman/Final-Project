const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectToDatabase } = require("./database/atlas-connection.js");
const { setupMQTT } = require("./services/mqttService.js");
const { errorHandler } = require("./middleware/errorHandler.js");

// Import routes
const authRoutes = require("./routes/authRoutes.js");
const employeeRoutes = require("./routes/employeeRoutes.js");
const stationRoutes = require("./routes/stationRoutes.js");
const qualificationRoutes = require("./routes/qualificationRoutes.js");
const assignmentRoutes = require("./routes/assignmentRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log("✅ Database connected successfully");

    // Setup MQTT
    setupMQTT();
    console.log("✅ MQTT service initialized");

    // Routes
    app.use("/api", authRoutes);
    app.use("/api", employeeRoutes);
    app.use("/api", stationRoutes);
    app.use("/api", qualificationRoutes);
    app.use("/api", assignmentRoutes);
    app.use("/api", dashboardRoutes);
    app.use("/api", reportRoutes);
    app.use("/api", userRoutes);

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.json({ status: "OK", timestamp: new Date().toISOString() });
    });

    // Error handling middleware (must be last)
    app.use(errorHandler);

    // Start the server
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});

startServer();
