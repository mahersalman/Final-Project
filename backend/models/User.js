const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    department: { type: String, required: false },
    email: { type: String },
    phone_number: { type: String },

    // reset fields
    passwordResetTokenHash: { type: String, index: true },
    passwordResetExpires: { type: Date },
    passwordChangedAt: { type: Date },
  },
  { collection: "user", timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
