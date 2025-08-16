const express = require("express");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { sendEmail } = require("../services/emailService");
const { forgotLimiter } = require("../middleware/rateLimit");
const { okGeneric } = require("../utils/genericResponse");
const {
  generateResetToken,
  hashResetToken,
  expiryDateFromNow,
  verifyResetToken,
  RESET_TOKEN_TTL_MINUTES,
} = require("../utils/passwordReset");
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
    if (exists)
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
    sendEmail({
      subject: "Welcome to MigdalOr!",
      username,
      password,
      first_name,
      last_name,
      email,
      department,
      phone_number,
      role,
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

/**
 * POST /auth/forgot-password
 * body: { email?: string, username?: string }
 * Always respond generically to avoid user enumeration.
 */
router.post("/forgot-password", forgotLimiter, async (req, res) => {
  try {
    const { email, username } = req.body || {};
    const query = email
      ? { email: email.trim().toLowerCase() }
      : username
      ? { username: username.trim() }
      : null;

    if (!query) return okGeneric(res);

    const user = await User.findOne(query);
    if (!user || !user.email) {
      // Respond generically
      return okGeneric(res);
    }

    // Generate token
    const raw = generateResetToken();
    const tokenHash = await hashResetToken(raw);

    user.passwordResetTokenHash = tokenHash;
    user.passwordResetExpires = expiryDateFromNow(RESET_TOKEN_TTL_MINUTES);
    await user.save();

    // Construct reset link
    const link = `${APP_BASE_URL}/reset-password?token=${encodeURIComponent(
      raw
    )}&uid=${user._id}`;

    // Send email (fire-and-forget)
    sendEmail({
      toEmail: user.email,
      toName: user.first_name,
      link,
    }).catch((e) => console.error("reset email error:", e?.body || e));

    return okGeneric(res);
  } catch (e) {
    console.error("/forgot-password error:", e);
    return okGeneric(res);
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
