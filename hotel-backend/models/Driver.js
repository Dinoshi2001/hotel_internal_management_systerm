/*const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  vehicleType: { type: String, required: true },
  status: {
    type: String,
    enum: ["Available", "Occupied"], // Only Available or Occupied
    default: "Available",
  },
  address: String,
}, { timestamps: true });

module.exports = mongoose.models.Driver || mongoose.model("Driver", DriverSchema);*/

const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vehicleType: { type: String, required: true },

  // FIXED ENUM
  status: {
    type: String,
    enum: ["Available", "Occupied"],
    default: "Available"
  }
}, { timestamps: true });

module.exports = mongoose.models.Driver || mongoose.model("Driver", DriverSchema);

