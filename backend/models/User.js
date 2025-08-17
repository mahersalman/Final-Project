const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    person_id: { type: String, index: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // bcrypt hash
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true },
    department: { type: String, trim: true },
    role: { type: String, trim: true },
    status: { type: String, trim: true },
    isAdmin: { type: Boolean, default: false },
  },
  { collection: "user", timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
