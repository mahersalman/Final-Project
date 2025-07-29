const mongoose = require("mongoose");
const { connectToDatabase } = require("./atlas-connection");

const Person = require("../models/Person");
const Station = require("../models/Station");
const WorkingStation = require("../models/WorkingStation");
const Qualification = require("../models/Qualification");
const Product = require("../models/Product");
const Assignment = require("../models/Assignment");
const User = require("../models/User");

const {
  samplePersons,
  sampleStations,
  sampleWorkingStations,
  sampleProducts,
  sampleQualifications,
  sampleAssignments,
} = require("./sampledata");

// Setup function
async function setupDatabase() {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Clear existing data (optional)
    await Person.deleteMany({});
    await Station.deleteMany({});
    await WorkingStation.deleteMany({});
    await Qualification.deleteMany({});
    await Product.deleteMany({});
    await Assignment.deleteMany({});
    console.log("Cleared existing data");

    // Insert sample data
    await Person.insertMany(samplePersons);
    console.log("✅ Persons inserted");

    await Station.insertMany(sampleStations);
    console.log("✅ Stations inserted");

    await WorkingStation.insertMany(sampleWorkingStations);
    console.log("✅ Working Stations inserted");

    await Product.insertMany(sampleProducts);
    console.log("✅ Products inserted");

    await Qualification.insertMany(sampleQualifications);
    console.log("✅ Qualifications inserted");

    await Assignment.insertMany(sampleAssignments);
    console.log("✅ Assignments inserted");

    console.log("\n🎉 Database setup complete!");
    console.log("\nCollections created:");
    console.log(
      "- persons (" + (await Person.countDocuments()) + " documents)"
    );
    console.log(
      "- stations (" + (await Station.countDocuments()) + " documents)"
    );
    console.log(
      "- workingstations (" +
        (await WorkingStation.countDocuments()) +
        " documents)"
    );
    console.log(
      "- products (" + (await Product.countDocuments()) + " documents)"
    );
    console.log(
      "- qualifications (" +
        (await Qualification.countDocuments()) +
        " documents)"
    );
    console.log(
      "- assignments (" + (await Assignment.countDocuments()) + " documents)"
    );
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the setup
setupDatabase();

// Export models for use in your application
module.exports = {
  Person,
  Station,
  WorkingStation,
  Qualification,
  Product,
  Assignment,
  User,
};
