const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  license_no: { type: String, required: true },
  phone: { type: String, required: true },
  vehicle_type: { type: String, required: true },
  status: { type: String, default: "Available" } // Available, On Trip, Inactive
}, { timestamps: true });

module.exports = mongoose.model("Driver", DriverSchema);
