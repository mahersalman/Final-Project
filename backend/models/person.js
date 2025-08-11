const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
  {
    person_id: String,
    first_name: String,
    last_name: String,
    department: String,
    status: String,
    role: String,
  },
  { collection: "person" }
);

module.exports =
  mongoose.models.Person || mongoose.model("Person", personSchema);
