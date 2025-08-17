const crypto = require("crypto");
const bcrypt = require("bcrypt");

const RESET_TOKEN_BYTES = 32; // 256-bit random
const RESET_TOKEN_TTL_MINUTES = 15; // link valid for 15 minutes

function generateResetToken() {
  // raw token returned for email, hash stored in DB
  const raw = crypto.randomBytes(RESET_TOKEN_BYTES).toString("hex"); // 64-char hex
  return raw;
}

async function hashResetToken(rawToken) {
  // bcrypt hash so if DB leaks, attackers can’t use token
  return bcrypt.hash(rawToken, 10);
}

function expiryDateFromNow(minutes = RESET_TOKEN_TTL_MINUTES) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

async function verifyResetToken(rawToken, tokenHash) {
  return bcrypt.compare(rawToken, tokenHash);
}

function generateTempPassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

module.exports = {
  generateResetToken,
  hashResetToken,
  expiryDateFromNow,
  verifyResetToken,
  RESET_TOKEN_TTL_MINUTES,
  generateTempPassword,
};
