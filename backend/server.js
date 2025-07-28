const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mqtt = require("mqtt");
const path = require("path");
const authRoutes = require("./routes/authRoutes");

const geneticAlgorithm = require("./GeneticAlgorithm.js");
const { getTopEmployeesForStation } = require("./GeneticAlgorithm");
const { getAllSortedEmployeesForStation } = require("./GeneticAlgorithm");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes after initializing app
const userRouter = require("./routes/authRoutes");
const Station = require("./models/station");
const Person = require("./models/person");
const Qualification = require("./models/qualification");
const Product = require("./models/product");
const WorkingStation = require("./models/workingStation");
const Assignment = require("./models/assignment");
const User = require("./models/User");

const mongoURI =
  "mongodb+srv://admin:Aa112233@migdalor.uqujiwf.mongodb.net/migdalor?retryWrites=true&w=majority&appName=migdalor";
console.log("Mongo URI:", mongoURI);

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    console.log("Connected to database:", mongoose.connection.name);
    if (mongoose.connection.db.databaseName !== "migdalor") {
      console.error(
        'Warning: Connected to incorrect database. Expected "migdalor", got "' +
          mongoose.connection.db.databaseName +
          '"'
      );
    }
  })
  .catch((err) => console.log(err));

app.use("/api/users", userRouter);

// MQTT Client setup
const mqttBroker = "mqtt://test.mosquitto.org"; // Replace with MQTT broker address
const mqttClient = mqtt.connect(mqttBroker);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Subscribe to topics
  mqttClient.subscribe("Braude/Shluker/#", (err) => {
    if (!err) {
      console.log("Subscribed to Braude/Shluker/#");
    }
  });
});

mqttClient.on("message", async (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);

  // Save the message to the mqttMsg collection
  try {
    const newMessage = {
      topic: topic,
      message: message.toString(),
      timestamp: new Date(),
    };

    await mongoose.connection.db.collection("mqttMsg").insertOne(newMessage);
    console.log("Message saved to mqttMsg collection");
  } catch (error) {
    console.error("Error saving MQTT message to database:", error);
  }
});

// Define Routes
app.use("/api", authRoutes);

// Login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Forgot password route
app.post("/api/forgot-password", async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.json({ message: "Password reset" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Reset password route
app.post("/api/reset-password", async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//get all stations
app.get("/api/stations", async (req, res) => {
  try {
    console.log("Attempting to fetch stations...");
    const stations = await Station.find({});
    console.log("Fetched stations:", stations);
    console.log("Number of stations found:", stations.length);
    res.json(stations);
  } catch (error) {
    console.error("Error fetching stations:", error);
    res
      .status(500)
      .json({ message: "Error fetching stations", error: error.message });
  }
});

//get all employees
app.get("/api/employees", async (req, res) => {
  try {
    console.log("Fetching employees...");
    const employees = await Person.find({});
    console.log("Employees found:", employees.length);
    console.log("Sample employee:", employees[0]);
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(500)
      .json({ message: "Error fetching employees", error: error.message });
  }
});

//route to save a person
app.post("/api/employees", async (req, res) => {
  try {
    const newPerson = new Person({
      person_id: req.body.person_id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      department: req.body.department,
      status: req.body.status,
      role: req.body.role || "Employee",
    });

    const savedPerson = await newPerson.save();
    console.log("New person saved:", savedPerson);
    res.status(201).json(savedPerson);
  } catch (error) {
    console.error("Error saving person:", error);
    res
      .status(500)
      .json({ message: "Error saving person", error: error.message });
  }
});

//save new qualications for employee
app.post("/api/qualifications", async (req, res) => {
  try {
    const { person_id, station_name, avg } = req.body;
    const newQualification = new Qualification({
      person_id,
      station_name,
      avg,
    });
    const savedQualification = await newQualification.save();
    res.status(201).json(savedQualification);
  } catch (error) {
    console.error("Error saving qualification:", error);
    res
      .status(500)
      .json({ message: "Error saving qualification", error: error.message });
  }
});

//get all qualifications
app.get("/api/qualifications", async (req, res) => {
  try {
    console.log("Fetching qualifications...");
    const qualifications = await Qualification.find({});
    console.log("Qualifications found:", qualifications.length);
    console.log("Sample qualification:", qualifications[0]);
    res.json(qualifications);
  } catch (error) {
    console.error("Error fetching qualifications:", error);
    res
      .status(500)
      .json({ message: "Error fetching qualifications", error: error.message });
  }
});

// Update or create employee qualifications
app.put("/api/qualifications", async (req, res) => {
  try {
    const { person_id, station_name, avg } = req.body;
    console.log("Received qualification update request:", {
      person_id,
      station_name,
      avg,
    });

    // First, find the person by their person_id
    const person = await Person.findOne({ person_id });
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    // Find and update the qualification, or create a new one if it doesn't exist
    const qualification = await Qualification.findOneAndUpdate(
      { person_id: person.person_id, station_name },
      { avg },
      { new: true, upsert: true }
    );

    console.log("Qualification updated:", qualification);
    res.json(qualification);
  } catch (error) {
    console.error("Error updating qualification:", error);
    res
      .status(500)
      .json({ message: "Error updating qualification", error: error.message });
  }
});

// Get employee qualifications
app.get("/api/qualifications/:employeeId", async (req, res) => {
  try {
    console.log(
      "Fetching qualifications for employeeId:",
      req.params.employeeId
    );
    const qualifications = await Qualification.find({
      person_id: req.params.employeeId,
    });
    console.log("Qualifications found:", qualifications);
    res.json(qualifications);
  } catch (error) {
    console.error("Error fetching qualifications:", error);
    res
      .status(500)
      .json({ message: "Error fetching qualifications", error: error.message });
  }
});

// Update employee data
app.put("/api/employees/:employeeId", async (req, res) => {
  try {
    const { department, status } = req.body;

    // Prepare the update object
    const updateObj = {};
    if (department) updateObj.department = department;
    if (status) updateObj.status = status;

    const updatedEmployee = await Person.findOneAndUpdate(
      { person_id: req.params.employeeId },
      { $set: updateObj },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // If status has changed, log the change
    if (status && updatedEmployee.status !== status) {
      console.log(
        `Employee ${updatedEmployee.person_id} status changed from ${updatedEmployee.status} to ${status}`
      );
    }

    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res
      .status(500)
      .json({ message: "Error updating employee", error: error.message });
  }
});

// route for dashboard data
app.get("/api/dashboard-data", async (req, res) => {
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "An unexpected error occurred",
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    console.log("Attempting to fetch products...");
    const products = await Product.find({}).select("product_name");
    console.log("Fetched products:", products);
    console.log("Number of products found:", products.length);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

app.post("/api/assign-employees", async (req, res) => {
  try {
    const { selectedStations, selectedEmployees } = req.body;

    // Fetch full employee data
    const employees = await Person.find({ _id: { $in: selectedEmployees } });

    // Fetch full station data
    const stations = await Station.find({ _id: { $in: selectedStations } });

    // Fetch qualifications for selected employees
    const qualifications = await Qualification.find({
      person_id: { $in: selectedEmployees },
    });

    // Create a detailed assignment object
    const detailedAssignment = {};
    Object.entries(bestAssignment).forEach(([stationId, employeeId]) => {
      const station = stations.find((s) => s.station_id === stationId);
      const employee = employees.find((e) => e._id.toString() === employeeId);
      const qualification = qualifications.find(
        (q) =>
          q.person_id === employeeId && q.station_name === station.station_name
      );
      detailedAssignment[employeeId] = {
        stationId,
        stationName: station.station_name,
        qualificationScore: qualification ? qualification.avg : 0,
      };
    });

    res.json(detailedAssignment);
  } catch (error) {
    console.error("Error assigning employees:", error);
    res
      .status(500)
      .json({ message: "Error assigning employees", error: error.message });
  }
});

app.get("/api/top-employees/:stationName/:count", async (req, res) => {
  try {
    const { stationName, count } = req.params;
    const station = await Station.findOne({ station_name: stationName });
    const employees = await Person.find({});
    const qualifications = await Qualification.find({
      station_name: stationName,
    });

    const topEmployees = getTopEmployeesForStation(
      employees,
      station,
      qualifications,
      parseInt(count)
    );

    res.json(topEmployees);
  } catch (error) {
    console.error("Error fetching top employees:", error);
    res
      .status(500)
      .json({ message: "Error fetching top employees", error: error.message });
  }
});

app.get("/api/sorted-employees/:stationName", async (req, res) => {
  try {
    const { stationName } = req.params;
    const station = await Station.findOne({ station_name: stationName });
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const employees = await Person.find({});
    const qualifications = await Qualification.find({
      station_name: stationName,
    });

    const sortedEmployees = getAllSortedEmployeesForStation(
      employees,
      station,
      qualifications
    );

    res.json(sortedEmployees);
  } catch (error) {
    console.error("Error fetching sorted employees:", error);
    res.status(500).json({
      message: "Error fetching sorted employees",
      error: error.message,
    });
  }
});

app.get("/api/employees-with-qualifications/:stationName", async (req, res) => {
  try {
    const stationName = req.params.stationName;
    console.log(
      `Fetching employees with qualifications for station: ${stationName}`
    );

    // find all qualifications for the given station
    const qualifications = await Qualification.find({
      station_name: stationName,
    });

    // Extract person_ids from the qualifications
    const personIds = qualifications.map((qual) => qual.person_id);

    // Now, fetch the corresponding persons
    const employees = await Person.find({ person_id: { $in: personIds } });

    console.log(
      `Found ${employees.length} qualified employees for station ${stationName}`
    );

    // Combine employee data with their qualification
    const employeesWithQualifications = employees.map((employee) => {
      const qualification = qualifications.find(
        (q) => q.person_id === employee.person_id
      );
      return {
        _id: employee._id,
        person_id: employee.person_id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        department: employee.department,
        role: employee.role,
        qualification_avg: qualification ? qualification.avg : null,
      };
    });

    res.json(employeesWithQualifications);
  } catch (error) {
    console.error("Error fetching employees with qualifications:", error);
    res.status(500).json({
      message: "Error fetching employees with qualifications",
      error: error.message,
    });
  }
});

//route to get Shluker results
app.get("/api/shluker-results", async (req, res) => {
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

// New route to get working station for station
app.get("/api/workstations/:stationName", async (req, res) => {
  try {
    const { stationName } = req.params;
    console.log(`Fetching workstations for station: ${stationName}`);

    const station = await Station.findOne({ station_name: stationName });
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const workstations = await WorkingStation.find({
      station_name: stationName,
    });
    console.log(
      `Found ${workstations.length} workstations for station ${stationName}`
    );

    res.json(workstations);
  } catch (error) {
    console.error("Error fetching workstations:", error);
    res
      .status(500)
      .json({ message: "Error fetching workstations", error: error.message });
  }
});
// GET assignments for a specific date
app.get("/api/assignments", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const assignments = await Assignment.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).sort("date");

    res.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res
      .status(500)
      .json({ message: "Error fetching assignments", error: error.message });
  }
});

// POST new assignment
app.post("/api/assignments", async (req, res) => {
  try {
    const { date, workingStation_name, person_id, number_of_hours } = req.body;

    if (!date || !workingStation_name || !person_id || !number_of_hours) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAssignment = new Assignment({
      assignment_id: new mongoose.Types.ObjectId().toString(),
      date: new Date(date),
      number_of_hours,
      workingStation_name,
      person_id,
    });

    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (error) {
    console.error("Error saving assignment:", error);
    res
      .status(500)
      .json({ message: "Error saving assignment", error: error.message });
  }
});

// DELETE assignment
app.delete("/api/assignments", async (req, res) => {
  try {
    const { date, person_id, assignmentNumber } = req.body;

    if (!date || !person_id || !assignmentNumber) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["date", "person_id", "assignmentNumber"],
      });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // Find all assignments for the person on the given date
    const assignments = await Assignment.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
      person_id: person_id,
    }).sort("date");

    if (assignments.length === 0) {
      return res.status(404).json({
        message: "No assignments found for this person on the given date",
      });
    }

    // Delete the specified assignment (first or second)
    const assignmentToDelete = assignments[assignmentNumber - 1];
    if (!assignmentToDelete) {
      return res
        .status(404)
        .json({ message: "Specified assignment not found" });
    }

    await Assignment.findByIdAndDelete(assignmentToDelete._id);

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({
      message: "Error deleting assignment",
      error: error.message,
      stack: error.stack,
    });
  }
});

app.get("/api/report", async (req, res) => {
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

  console.log(
    `Generating report for date: ${startDate.toISOString()} to ${endDate.toISOString()}`
  );
  if (employee) {
    console.log(`Filtering for employee: ${employee}`);
  }

  let query = {
    timestamp: { $gte: startDate, $lt: endDate },
  };

  let messages = await mongoose.connection.db
    .collection("mqttMsg")
    .find(query)
    .toArray();

  console.log(`Total messages found: ${messages.length}`);

  let goodValves = 0;
  let invalidValves = 0;

  messages.forEach((msg) => {
    try {
      const parsedMessage = JSON.parse(msg.message);

      console.log("Parsed message:", parsedMessage);
      console.log("Message User ID:", parsedMessage["User ID"]);

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

  console.log(
    `Report results - Good Valves: ${goodValves}, Invalid Valves: ${invalidValves}`
  );

  return { goodValves, invalidValves };
}

//route for generate reports when we will have more workstations
// app.get('/api/report', async (req, res) => {
//   const { station, workstations, date, employee } = req.query;

//   try {
//     let reportData;
//     if (station && !workstations && !date && !employee) {
//       reportData = await generateMonthlyProductionReport(station);
//     } else if (station && workstations && !date && !employee) {
//       reportData = await generateWorkstationReport(station, workstations.split(','));
//     } else if (station && date) {
//       reportData = await generateDailyReport(station, workstations ? workstations.split(',') : null, date, employee);
//     } else {
//       return res.status(400).json({ error: 'Invalid combination of parameters' });
//     }

//     res.json(reportData);
//   } catch (error) {
//     console.error('Error generating report:', error);
//     res.status(500).json({ error: 'Error generating report' });
//   }
// });

// async function generateMonthlyProductionReport(station) {
//   const oneMonthAgo = new Date();
//   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//   const result = await mongoose.connection.db.collection('mqttMsg').aggregate([
//     {
//       $match: {
//         topic: { $regex: `^Braude/Shluker/${station}/` },
//         timestamp: { $gte: oneMonthAgo },
//         'message.Shluker Result': 'Good Valve'
//       }
//     },
//     {
//       $group: {
//         _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
//         totalProduction: { $sum: 1 }
//       }
//     },
//     { $sort: { _id: 1 } }
//   ]).toArray();

//   return result;
// }

// async function generateWorkstationReport(workstations) {
//   const oneMonthAgo = new Date();
//   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//   const result = await Promise.all(workstations.map(async (workstation) => {
//     const letter = workstation.match(/\d+/) ? String.fromCharCode(64 + parseInt(workstation.match(/\d+/)[0])) : '';
//     const topicRegex = new RegExp(`^Braude/Shluker/${letter}`);

//     const data = await mongoose.connection.db.collection('mqttMsg').aggregate([
//       {
//         $match: {
//           topic: { $regex: topicRegex },
//           timestamp: { $gte: oneMonthAgo },
//           'message.Shluker Result': 'Good Valve'
//         }
//       },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
//           production: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]).toArray();

//     return { workstation, data };
//   }));

//   return result;
// }

// async function generateDailyReport(station, workstations, date, employee) {
//   const startDate = new Date(date);
//   const endDate = new Date(date);
//   endDate.setDate(endDate.getDate() + 1);

//   let matchQuery = {
//     topic: { $regex: `^Braude/Shluker/${station}/` },
//     timestamp: { $gte: startDate, $lt: endDate }
//   };

//   if (employee) {
//     matchQuery['message.Person ID'] = employee;
//   }

//   if (workstations) {
//     const letterRegex = workstations.map(ws => {
//       const letter = ws.match(/\d+/) ? String.fromCharCode(64 + parseInt(ws.match(/\d+/)[0])) : '';
//       return letter;
//     }).join('|');
//     matchQuery.topic.$regex = new RegExp(`^Braude/Shluker/${station}/[${letterRegex}]`);
//   }

//   const result = await mongoose.connection.db.collection('mqttMsg').aggregate([
//     { $match: matchQuery },
//     {
//       $group: {
//         _id: "$message.Shluker Result",
//         count: { $sum: 1 }
//       }
//     }
//   ]).toArray();

//   return result;
// }

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
