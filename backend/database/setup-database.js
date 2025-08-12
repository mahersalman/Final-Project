const mongoose = require("mongoose");
const { connectToDatabase } = require("./atlas-connection");

const Person = require("../models/person");
const Station = require("../models/station");
const WorkingStation = require("../models/workingStation");
const Qualification = require("../models/qualification");
const Product = require("../models/product");
const Assignment = require("../models/assignment");
const User = require("../models/User");
const Department = require("../models/department");

const {
  sampleUsers,
  samplePersons,
  sampleStations,
  sampleWorkingStations,
  sampleProducts,
  sampleQualifications,
  sampleAssignments,
  DEPARTMENTS, // import here
} = require("./seedData");

async function setupDatabase() {
  try {
    await connectToDatabase();

    // Clear collections
    await Promise.all([
      User.deleteMany({}),
      Person.deleteMany({}),
      Station.deleteMany({}),
      WorkingStation.deleteMany({}),
      Qualification.deleteMany({}),
      Product.deleteMany({}),
      Assignment.deleteMany({}),
      Department.deleteMany({}), // <-- clear departments
    ]);
    console.log("🧹 Cleared existing data");

    // Insert seeds
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

    // Insert departments from array
    await Department.insertMany(DEPARTMENTS.map((name) => ({ name })));
    console.log("✅ Departments inserted");

    // Count log
    const [
      usersCnt,
      personsCnt,
      stationsCnt,
      wssCnt,
      productsCnt,
      qualsCnt,
      assignsCnt,
      depsCnt,
    ] = await Promise.all([
      User.countDocuments(),
      Person.countDocuments(),
      Station.countDocuments(),
      WorkingStation.countDocuments(),
      Product.countDocuments(),
      Qualification.countDocuments(),
      Assignment.countDocuments(),
      Department.countDocuments(),
    ]);

    console.log("\n🎉 Database setup complete!");
    console.log(`- users (${usersCnt})`);
    console.log(`- persons (${personsCnt})`);
    console.log(`- stations (${stationsCnt})`);
    console.log(`- workingstations (${wssCnt})`);
    console.log(`- products (${productsCnt})`);
    console.log(`- qualifications (${qualsCnt})`);
    console.log(`- assignments (${assignsCnt})`);
    console.log(`- departments (${depsCnt})`);
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

setupDatabase();
