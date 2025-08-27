const mongoose = require("mongoose");
require("dotenv").config();

// Read connection URI from environment variables
const uri = process.env.ATLAS_URI; // Changed from MONGO_URI to ATLAS_URI

async function connectToDatabase() {
  try {
    // Check if URI is provided
    if (!uri) {
      throw new Error("ATLAS_URI environment variable is not defined");
    }

    console.log("🔄 Connecting to MongoDB...");

    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri);

    console.log(
      "✅ Pinged your deployment. You successfully connected to MongoDB!"
    );
    console.log("📊 Connected to database:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
}

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🟡 Mongoose disconnected from MongoDB");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("👋 MongoDB connection closed through app termination");
  process.exit(0);
});

// Export for use in other files
module.exports = { connectToDatabase };
