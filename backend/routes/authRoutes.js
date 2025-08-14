// routes/authRoutes.js - Improved version of your existing code
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { send_mail } = require("../services/emailService");
// GET /api/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "username isAdmin department email phone"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
      department: user.department,
      email: user.email,
      phone: user.phone,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required" });

    const user = await User.findOne({ username });
    // Always treat as hashed
    if (!user)
      return res.status(401).json({ message: "Invalid username or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
        department: user.department,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        department: user.department,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// --- Admin-only Register ---
// POST /api/register (admin only)
router.post("/register", requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      username,
      first_name,
      last_name,
      password,
      isAdmin = false,
      department,
      email,
      phone_number,
    } = req.body || {};
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });

    const exists = await User.findOne({ username });
    if (exists)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      first_name,
      last_name,
      password: hashedPassword,
      isAdmin: !!isAdmin,
      department,
      email,
      phone_number,
    });

    // ✅ Send welcome email after success
    send_mail({
      subject: "Welcome to MigdalOr!",
      username,
      password,
      first_name,
      last_name,
      email,
      department,
      phone_number,
    }).catch((err) => console.error("Email send error:", err));

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        isAdmin: newUser.isAdmin,
        department: newUser.department,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});
// Forgot password route
router.post("/forgot-password", async (req, res) => {});

// Reset password route
router.post("/reset-password", async (req, res) => {});

module.exports = router;
