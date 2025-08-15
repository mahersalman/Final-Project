const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Qualification = require("../models/qualification");
const {
  getTopEmployeesForStation,
  getAllSortedEmployeesForStation,
  geneticAlgorithm,
} = require("../geneticAlgorithm.js");
const Station = require("../models/station");

// Get all employees
router.get("/employees", async (req, res) => {
  try {
    console.log("Fetching employees...");
    const employees = await User.find({});
    console.log("Employees found:", employees.length);
    console.log("Sample employee:", employees[0]);
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      message: "Error fetching employees",
      error: error.message,
    });
  }
});

// Create new employee
router.post("/employees", async (req, res) => {
  try {
    const newPerson = new User({
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
    res.status(500).json({
      message: "Error saving person",
      error: error.message,
    });
  }
});

// Update employee data
router.put("/employees/:employeeId", async (req, res) => {
  try {
    const { department, status } = req.body;

    // Prepare the update object
    const updateObj = {};
    if (department) updateObj.department = department;
    if (status) updateObj.status = status;

    const updatedEmployee = await User.findOneAndUpdate(
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
    res.status(500).json({
      message: "Error updating employee",
      error: error.message,
    });
  }
});

// Get top employees for a station
router.get("/top-employees/:stationName/:count", async (req, res) => {
  try {
    const { stationName, count } = req.params;
    const station = await Station.findOne({ station_name: stationName });
    const employees = await User.find({});
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
    res.status(500).json({
      message: "Error fetching top employees",
      error: error.message,
    });
  }
});

// Get sorted employees for a station
router.get("/sorted-employees/:stationName", async (req, res) => {
  try {
    const { stationName } = req.params;
    const station = await Station.findOne({ station_name: stationName });
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const employees = await User.find({});
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

// Get employees with qualifications for a station
router.get("/employees-with-qualifications/:stationName", async (req, res) => {
  try {
    const stationName = req.params.stationName;
    console.log(
      `Fetching employees with qualifications for station: ${stationName}`
    );

    // Find all qualifications for the given station
    const qualifications = await Qualification.find({
      station_name: stationName,
    });

    // Extract person_ids from the qualifications
    const personIds = qualifications.map((qual) => qual.person_id);

    // Fetch the corresponding persons
    const employees = await User.find({ person_id: { $in: personIds } });

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

// Assign employees to stations
router.post("/assign-employees", async (req, res) => {
  try {
    const { selectedStations, selectedEmployees } = req.body;

    // Fetch full employee data
    const employees = await User.find({ _id: { $in: selectedEmployees } });

    // Fetch full station data
    const stations = await Station.find({ _id: { $in: selectedStations } });

    // Fetch qualifications for selected employees
    const qualifications = await Qualification.find({
      person_id: { $in: selectedEmployees },
    });

    // Create a detailed assignment object
    const detailedAssignment = {};
    const optimalAssignment = geneticAlgorithm(
      employees,
      stations,
      qualifications
    );

    Object.entries(optimalAssignment).forEach(([stationId, employeeId]) => {
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
    res.status(500).json({
      message: "Error assigning employees",
      error: error.message,
    });
  }
});
module.exports = router;
