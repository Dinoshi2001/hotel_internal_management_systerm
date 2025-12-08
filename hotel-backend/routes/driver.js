const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Driver schema
const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Driver name is required"] },
    phone: { type: String, required: [true, "Phone number is required"] },
    licenseNumber: { type: String, required: [true, "License number is required"] },
    vehicleType: { type: String, enum: ["Car", "Van", "Bus", "Taxi"], default: "" },
    address: { type: String, default: "" },
    status: { type: String, enum: ["Available", "On Trip", "Unavailable"], default: "Available" },
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);

// ===================
// CRUD ROUTES
// ===================

// Get all drivers
router.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching drivers", error: err.message });
  }
});

// Add driver
router.post("/", async (req, res) => {
  try {
    const { name, phone, licenseNumber, vehicleType, address } = req.body;

    if (!name || !phone || !licenseNumber) {
      return res.status(400).json({ success: false, message: "Name, Phone, and License Number are required" });
    }

    const driver = new Driver({ name, phone, licenseNumber, vehicleType, address });
    const saved = await driver.save();
    res.status(201).json({ success: true, driver: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to add driver", error: err.message });
  }
});

// Update driver
router.put("/:id", async (req, res) => {
  try {
    const updated = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Driver not found" });
    res.json({ success: true, driver: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to update driver", error: err.message });
  }
});

// Delete driver
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Driver.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Driver not found" });
    res.json({ success: true, message: "Driver deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to delete driver", error: err.message });
  }
});

module.exports = router;
