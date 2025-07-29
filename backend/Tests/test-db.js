const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://admin:Aa112233@migdalor.uqujiwf.mongodb.net/?retryWrites=true&w=majority&appName=migdalor";

async function testConnection() {
  try {
    console.log("Testing MongoDB connection...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Successfully connected to MongoDB!");
    console.log("Database name:", mongoose.connection.name);

    // List collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Collections found:",
      collections.map((c) => c.name)
    );

    await mongoose.disconnect();
    console.log("Connection closed.");
  } catch (error) {
    console.log("❌ Failed to connect to MongoDB:");
    console.log("Error:", error.message);

    if (error.message.includes("ENOTFOUND")) {
      console.log("🔍 This likely means the MongoDB cluster no longer exists.");
    } else if (error.message.includes("authentication failed")) {
      console.log("🔍 The cluster exists but credentials are wrong.");
    }
  }
}

testConnection();
