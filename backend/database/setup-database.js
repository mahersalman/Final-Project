const mongoose = require("mongoose");
const { connectToDatabase } = require("./atlas-connection");
const bcrypt = require("bcrypt");

const Station = require("../models/station");
const WorkingStation = require("../models/workingStation");
const Qualification = require("../models/qualification");
const Product = require("../models/product");
const Assignment = require("../models/assignment");
const User = require("../models/User");
const Department = require("../models/department");

const {
  sampleUsers,
  sampleStations,
  sampleWorkingStations,
  sampleProducts,
  sampleQualifications,
  sampleAssignments,
  DEPARTMENTS, // import here
  buildMqttSeedMessages,
} = require("./seedData");

async function setupDatabase() {
  try {
    await connectToDatabase();

    // Clear collections
    await Promise.all([
      User.deleteMany({}),
      Station.deleteMany({}),
      WorkingStation.deleteMany({}),
      Qualification.deleteMany({}),
      Product.deleteMany({}),
      Assignment.deleteMany({}),
      Department.deleteMany({}),
      mongoose.connection.db.collection("mqttMsg").deleteMany({}),
    ]);
    console.log("🧹 Cleared existing data");

    // Hash all user passwords before insert
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (u) => {
        // if already bcrypt ($2…) keep as is (allows pre-hashed values in seedData)
        if (typeof u.password === "string" && u.password.startsWith("$2")) {
          return u;
        }
        const password = u.password;
        const passwordHash = await bcrypt.hash(password, 10);
        return { ...u, password: passwordHash };
      })
    );

    await User.insertMany(hashedUsers);
    console.log("✅ Users inserted");

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

    // Insert historical MQTT messages for reports testing
    const mqttSeed = buildMqttSeedMessages();
    if (mqttSeed && mqttSeed.length) {
      await mongoose.connection.db.collection("mqttMsg").insertMany(mqttSeed);
      console.log(`✅ MQTT messages inserted (${mqttSeed.length})`);
    }

    // Count log
    const [
      usersCnt,
      stationsCnt,
      wssCnt,
      productsCnt,
      qualsCnt,
      assignsCnt,
      depsCnt,
      mqttCnt,
    ] = await Promise.all([
      User.countDocuments(),
      Station.countDocuments(),
      WorkingStation.countDocuments(),
      Product.countDocuments(),
      Qualification.countDocuments(),
      Assignment.countDocuments(),
      Department.countDocuments(),
      mongoose.connection.db.collection("mqttMsg").countDocuments(),
    ]);

    console.log("\n🎉 Database setup complete!");
    console.log(`- users (${usersCnt})`);
    console.log(`- stations (${stationsCnt})`);
    console.log(`- workingstations (${wssCnt})`);
    console.log(`- products (${productsCnt})`);
    console.log(`- qualifications (${qualsCnt})`);
    console.log(`- assignments (${assignsCnt})`);
    console.log(`- departments (${depsCnt})`);
    console.log(`- mqttMsg (${mqttCnt})`);
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

setupDatabase();
