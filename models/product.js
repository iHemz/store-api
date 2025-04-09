const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name must be provided"],
    minLength: [1, "name cannot be empty"],
    maxLength: [20, "name cannot be more than 20 characters"],
  },
  price: {
    type: Number,
    min: [0, "Product price cannot be below 0"],
    required: [true, "Product price must be provided"],
  },
  company: {
    type: String,
    enum: {
      values: ["marcos", "liddy", "ikea", "caressa"],
      message: "{VALUE} is not supported",
    },
    required: [true, "Product company must be provided"],
    maxLength: [50, "Company name cannot exceed 50 characters"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0.0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
