const express = require("express");
const router = express.Router();

const Taxi = require("../models/Taxi");
const Driver = require("../models/Driver");
const TaxiRequest = require("../models/TaxiRequest");
const TaxiAllocation = require("../models/TaxiAllocation");

// GET all taxis (or filter by status if you want)
router.get("/available-taxis", async (req, res) => {
  try {
    const taxis = await Taxi.find({}); // just fetch all taxis
    res.json(taxis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all drivers
router.get("/available-drivers", async (req, res) => {
  try {
    const drivers = await Driver.find({}); // fetch all drivers
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST assign taxi + driver
router.post("/assign", async (req, res) => {
  try {
    const { requestId, taxiId, driverId, allocatedFrom, allocatedTo } = req.body;

    if (!requestId || !taxiId || !driverId || !allocatedFrom || !allocatedTo) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if request exists
    const request = await TaxiRequest.findById(requestId);
    if (!request) return res.status(400).json({ error: "Request not found" });

    // Save allocation without changing Taxi/Driver status
    const allocation = new TaxiAllocation({
      requestId,
      taxiId,
      driverId,
      allocatedFrom,
      allocatedTo,
    });

    await allocation.save();

    res.json({ message: "Taxi allocation saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
