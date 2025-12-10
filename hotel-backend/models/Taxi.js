/*const mongoose = require("mongoose");

const taxiSchema = new mongoose.Schema(
  {
    taxiNumber: { type: String, required: true, unique: true },
    taxiType: { type: String, required: true },
    seats: { type: Number, required: true },
    status: { type: String, enum: ["Available", "On Trip", "Maintenance"], default: "Available" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Taxi", taxiSchema);*/

const mongoose = require("mongoose");

const taxiSchema = new mongoose.Schema(
  {
    taxiNumber: { type: String, required: true, unique: true },
    taxiType: { type: String, required: true },
    seats: { type: Number, required: true },

    // UPDATED ENUM LIST
    status: { 
      type: String, 
      enum: ["Available", "On Trip", "Maintenance", "Occupied"], 
      default: "Available" 
    }
  },
  { timestamps: true }
);

// FIX OverwriteModelError
module.exports = mongoose.models.Taxi || mongoose.model("Taxi", taxiSchema);

