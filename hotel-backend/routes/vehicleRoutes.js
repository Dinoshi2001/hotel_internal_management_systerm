const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");

// Generate random vehicle number
function generateVehicleNumber() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = Math.floor(1000 + Math.random() * 9000);
  const region = "WP";
  const randomLetter =
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    letters.charAt(Math.floor(Math.random() * letters.length));
  return `${region}-${randomLetter}-${digits}`;
}

// Get all vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new vehicle
router.post("/", async (req, res) => {
  try {
    const { nic, guestName, guestAddress, contactNumber, vehicleType, vehicleNumber } = req.body;

    if (!nic || !guestName || !guestAddress || !contactNumber || !vehicleType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Use vehicleNumber from frontend if provided, otherwise generate
    const finalVehicleNumber = vehicleNumber && vehicleNumber.trim() !== ""
      ? vehicleNumber
      : generateVehicleNumber();

    const newVehicle = new Vehicle({
      nic,
      guestName,
      guestAddress,
      contactNumber,
      vehicleType,
      vehicleNumber: finalVehicleNumber,
    });

    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update vehicle
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nic, guestName, guestAddress, contactNumber, vehicleType, vehicleNumber } = req.body;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    vehicle.nic = nic || vehicle.nic;
    vehicle.guestName = guestName || vehicle.guestName;
    vehicle.guestAddress = guestAddress || vehicle.guestAddress;
    vehicle.contactNumber = contactNumber || vehicle.contactNumber;
    vehicle.vehicleType = vehicleType || vehicle.vehicleType;
    vehicle.vehicleNumber = vehicleNumber || vehicle.vehicleNumber; // keep existing if not provided

    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete vehicle
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    res.json({ message: "Vehicle deleted successfully", vehicle });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
