const express = require("express");
const router = express.Router();
const TaxiRequest = require("../models/TaxiRequest");

// GET all taxi requests
router.get("/", async (req, res) => {
  try {
    const requests = await TaxiRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new taxi request
router.post("/", async (req, res) => {
  try {
    const newRequest = new TaxiRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update taxi request by id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRequest = await TaxiRequest.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRequest) return res.status(404).json({ error: "Taxi request not found" });
    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE taxi request by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await TaxiRequest.findByIdAndDelete(id);
    if (!deletedRequest) return res.status(404).json({ error: "Taxi request not found" });
    res.json({ message: "Taxi request deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
