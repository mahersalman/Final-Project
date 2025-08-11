const mongoose = require("mongoose");
const { connectToDatabase } = require("./atlas-connection");

const Person = require("../models/person");
const Station = require("../models/station");
const WorkingStation = require("../models/workingStation");
const Qualification = require("../models/qualification");
const Product = require("../models/product");
const Assignment = require("../models/assignment");
const User = require("../models/User");

const {
  sampleUsers, // <-- add this
  samplePersons,
  sampleStations,
  sampleWorkingStations,
  sampleProducts,
  sampleQualifications,
  sampleAssignments,
} = require("./sampledata"); // make sure sampledata exports sampleUsers

async function setupDatabase() {
  try {
    await connectToDatabase();

    // Clear existing data (dev-only)
    await Promise.all([
      User.deleteMany({}),
      Person.deleteMany({}),
      Station.deleteMany({}),
      WorkingStation.deleteMany({}),
      Qualification.deleteMany({}),
      Product.deleteMany({}),
      Assignment.deleteMany({}),
    ]);
    console.log("🧹 Cleared existing data");

    // Insert seed data
    await User.insertMany(sampleUsers);
    console.log("✅ Users inserted");

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

    // Counts
    const [
      usersCnt,
      personsCnt,
      stationsCnt,
      wssCnt,
      productsCnt,
      qualsCnt,
      assignsCnt,
    ] = await Promise.all([
      User.countDocuments(),
      Person.countDocuments(),
      Station.countDocuments(),
      WorkingStation.countDocuments(),
      Product.countDocuments(),
      Qualification.countDocuments(),
      Assignment.countDocuments(),
    ]);

    console.log("\n🎉 Database setup complete!");
    console.log(`- users (${usersCnt})`);
    console.log(`- persons (${personsCnt})`);
    console.log(`- stations (${stationsCnt})`);
    console.log(`- workingstations (${wssCnt})`);
    console.log(`- products (${productsCnt})`);
    console.log(`- qualifications (${qualsCnt})`);
    console.log(`- assignments (${assignsCnt})`);
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

setupDatabase();

module.exports = {
  Person,
  Station,
  WorkingStation,
  Qualification,
  Product,
  Assignment,
  User,
};
