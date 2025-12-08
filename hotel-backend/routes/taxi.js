const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Taxi Schema
const taxiSchema = new mongoose.Schema(
  {
    taxiNumber: { type: String, required: true, unique: true },
    taxiType: { type: String, required: true },
    seats: { type: Number, required: true }, // match React form field
    status: { type: String, enum: ["Available", "On Trip", "Maintenance"], default: "Available" }
  },
  { timestamps: true }
);

const Taxi = mongoose.model("Taxi", taxiSchema);

// GET ALL TAXIS
router.get("/", async (req, res) => {
  try {
    const taxis = await Taxi.find().sort({ createdAt: -1 });
    res.json({ success: true, taxis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADD TAXI
router.post("/", async (req, res) => {
  try {
    const taxi = new Taxi(req.body);
    const saved = await taxi.save();
    res.status(201).json({ success: true, taxi: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// UPDATE TAXI
router.put("/:id", async (req, res) => {
  try {
    const updated = await Taxi.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, taxi: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE TAXI
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Taxi.findByIdAndDelete(req.params.id);
    res.json({ success: true, taxi: deleted });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
