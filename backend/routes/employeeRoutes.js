const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middleware/auth");
const User = require("../models/User");
const Qualification = require("../models/qualification");
const bcrypt = require("bcrypt");

const {
  getTopEmployeesForStation,
  getAllSortedEmployeesForStation,
  geneticAlgorithm,
} = require("../geneticAlgorithm.js");
const Station = require("../models/station");

// Get all employees
router.get("/employees", async (req, res) => {
  try {
    const employees = await User.find({}, "-password -__v");
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      message: "Error fetching employees",
      error: error.message,
    });
  }
});

// Update employee data
router.put(
  "/employees/:employeeId",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        username,
        first_name,
        last_name,
        email,
        phone,
        department,
        role,
        status,
        isAdmin,
      } = req.body;

      const updateObj = {};
      if (username !== undefined) updateObj.username = username;
      if (first_name !== undefined) updateObj.first_name = first_name;
      if (last_name !== undefined) updateObj.last_name = last_name;
      if (email !== undefined) updateObj.email = email;
      if (phone !== undefined) updateObj.phone = phone;
      if (department !== undefined) updateObj.department = department;
      if (role !== undefined) updateObj.role = role;
      if (status !== undefined) updateObj.status = status;
      if (isAdmin !== undefined) updateObj.isAdmin = !!isAdmin;

      const updated = await User.findOneAndUpdate(
        { person_id: req.params.employeeId },
        { $set: updateObj },
        { new: true }
      );

      if (!updated)
        return res.status(404).json({ message: "Employee not found" });
      res.json(updated);
    } catch (error) {
      console.error("Error updating employee:", error);
      res
        .status(500)
        .json({ message: "Error updating employee", error: error.message });
    }
  }
);

// Admin: change a user's password by person_id
router.put(
  "/employees/:personId/password",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const { newPassword } = req.body || {};
      if (!newPassword || newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }

      const user = await User.findOne({ person_id: req.params.personId });
      if (!user) return res.status(404).json({ message: "User not found" });

      user.password = await bcrypt.hash(newPassword, 10);
      user.passwordChangedAt = new Date();
      await user.save();

      return res.json({ message: "Password updated" });
    } catch (e) {
      console.error("admin password update error:", e);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

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

    // Find all qualifications for the given station
    const qualifications = await Qualification.find({
      station_name: stationName,
    });

    // Extract person_ids from the qualifications
    const personIds = qualifications.map((qual) => qual.person_id);

    // Fetch the corresponding persons
    const employees = await User.find({ person_id: { $in: personIds } });

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
