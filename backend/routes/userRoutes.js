const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { requireAuth } = require("../middleware/auth");

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
      first_name: user.first_name,
      last_name: user.last_name,
      isAdmin: user.isAdmin,
      department: user.department,
      email: user.email,
      phone_number: user.phone_number,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

//Change Password (logged-in user)
router.put("/me/password", async (req, res) => {
  try {
    const { newPassword } = req.body || {};
    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date();
    await user.save();
  } catch (e) {
    console.error("PUT /me/password error", e);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
