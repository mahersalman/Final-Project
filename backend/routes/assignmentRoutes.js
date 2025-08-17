const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Assignment = require("../models/assignment");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// GET assignments for a specific date
router.get("/assignments", async (req, res) => {
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
    res.status(500).json({
      message: "Error fetching assignments",
      error: error.message,
    });
  }
});

// POST new assignment
router.post("/assignments", requireAuth, requireAdmin, async (req, res) => {
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
    res.status(500).json({
      message: "Error saving assignment",
      error: error.message,
    });
  }
});

// DELETE assignment
router.delete("/assignments", requireAuth, requireAdmin, async (req, res) => {
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
      return res.status(404).json({
        message: "Specified assignment not found",
      });
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

module.exports = router;
