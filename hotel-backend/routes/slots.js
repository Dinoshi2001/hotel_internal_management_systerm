const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");

// GET /api/slots
router.get("/", async (req, res) => {
  try {
    const slots = await Slot.find().sort({ slotId: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/slots  (create new slot)
router.post("/", async (req, res) => {
  try {
    const { slotId, status } = req.body;
    const slot = new Slot({ slotId, status });
    const saved = await slot.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/slots/:id  (update by Mongo _id)
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body; // e.g. { status, guestName, vehicleNo }
    const updated = await Slot.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/slots/:id
router.delete("/:id", async (req, res) => {
  try {
    await Slot.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
