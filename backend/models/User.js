const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    department: { type: String, required: false },
    email: { type: String },
    phone: { type: String },
  },
  { collection: "user" }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
