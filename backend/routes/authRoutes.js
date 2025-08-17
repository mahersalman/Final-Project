const express = require("express");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { sendEmail } = require("../services/emailService");
const { forgotLimiter } = require("../middleware/rateLimit");
const {
  generateResetToken,
  hashResetToken,
  expiryDateFromNow,
  verifyResetToken,
  RESET_TOKEN_TTL_MINUTES,
  generateTempPassword,
} = require("../utils/password");
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";

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
      person_id,
      first_name,
      last_name,
      password, // optional; we can generate if missing
      isAdmin = false,
      department,
      email,
      phone_number, // incoming legacy name
      phone, // or new name
      role = "Employee",
      status = "פעיל",
    } = req.body || {};

    // username default = person_id if not given
    const finalUsername = (username || person_id || "").trim();
    if (!finalUsername) {
      return res
        .status(400)
        .json({ message: "username or person_id is required" });
    }

    const exists = await User.findOne({ username: finalUsername });
    if (exists || exists.email === email)
      return res.status(400).json({ message: "Username already exists" });

    // require names
    if (!first_name || !last_name) {
      return res
        .status(400)
        .json({ message: "first_name and last_name are required" });
    }

    // password: use provided or generate a temp one
    const tmp = require("crypto").randomBytes(8).toString("base64url"); // ~11 chars
    const plainPassword = password && password.length >= 6 ? password : tmp;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newUser = await User.create({
      person_id: person_id || null,
      username: finalUsername,
      password: hashedPassword,
      first_name,
      last_name,
      isAdmin: !!isAdmin,
      department: department || "",
      email: email || "",
      phone: phone ?? phone_number ?? "",
      role,
      status,
    });

    // ✅ Send welcome email after success
    await sendEmail({
      subject: "Welcome to MigdalOr!",
      to: { email, name: `${first_name} ${last_name}`.trim() || username },
      keyValues: {
        username,
        password,
        first_name,
        last_name,
        email,
        department,
        phone_number,
        role,
        status,
      },
      excludeKeys: [],
      title: "Migdalor",
    }).catch((err) => console.error("Email send error:", err));

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        person_id: newUser.person_id,
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        isAdmin: newUser.isAdmin,
        department: newUser.department,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email || typeof email !== "string") {
      return res.json({ success: false, message: "Invalid email address." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.json({ success: false, message: "Invalid email address." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.json({
        success: false,
        message: "There is no account related to this email.",
      });
    }

    // 1) Generate a temporary password
    const temp = generateTempPassword(12);

    // 2) Hash and update the password
    user.password = await bcrypt.hash(temp, 10);
    await user.save();

    // 3) Send temporary password by email
    await sendEmail({
      subject: "Your Temporary Password",
      to: {
        email: user.email,
        name:
          `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
          user.username,
      },
      keyValues: {
        username: user.username,
        new_password: temp,
        note: "Please log in and change your password immediately.",
      },
      title: "Migdalor",
    }).catch((e) => {
      console.error("sendEmail error:", e?.body || e);
    });

    return res.json({
      success: true,
      message: "An email has been sent with your new password.",
    });
  } catch (e) {
    console.error("/forgot-password error:", e);
    return res.json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
});
/**
 * POST /auth/reset-password
 * body: { uid: string, token: string, newPassword: string }
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { uid, token, newPassword } = req.body || {};
    if (!uid || !token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Missing uid, token or password" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findById(uid);
    if (!user || !user.passwordResetTokenHash || !user.passwordResetExpires) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    if (user.passwordResetExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const ok = await verifyResetToken(token, user.passwordResetTokenHash);
    if (!ok) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Rotate: clear token so it can't be reused
    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date();
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // (Optional) Invalidate server sessions / JWTs issued before passwordChangedAt
    // You can add a JWT claim check: token.iat > passwordChangedAt

    return res.json({ message: "Password updated successfully" });
  } catch (e) {
    console.error("reset-password error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
