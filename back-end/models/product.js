const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_name: String,
    company: String,
  },
  { collection: "product" }
);

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
