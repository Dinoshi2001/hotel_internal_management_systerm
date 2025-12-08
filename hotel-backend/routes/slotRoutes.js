const express = require("express");
const router = express.Router();
const SlotAllocation = require("../models/SlotAllocation");
const Vehicle = require("../models/Vehicle");

// Allocate slot
router.post("/allocate", async (req, res) => {
  try {
    const { slotNumber, vehicleId } = req.body;

    // Check if slot is already allocated and not exited
    const latestAllocation = await SlotAllocation.findOne({ slotNumber }).sort({ allocationTime: -1 });
    if (latestAllocation && latestAllocation.allocateStatus === "allocated") {
      return res.status(400).json({ message: "Slot already allocated" });
    }

    const allocation = new SlotAllocation({
      slotNumber,
      vehicle: vehicleId,
      allocateStatus: "allocated",
    });

    await allocation.save();

    res.status(201).json({ message: "Slot allocated successfully", allocation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Exit slot
router.post("/exit", async (req, res) => {
  try {
    const { slotNumber } = req.body;

    // Find latest allocation for slot
    const allocation = await SlotAllocation.findOne({ slotNumber }).sort({ allocationTime: -1 });
    if (!allocation || allocation.allocateStatus === "exited") {
      return res.status(400).json({ message: "Slot is already free" });
    }

    allocation.allocateStatus = "exited";
    allocation.exitTime = new Date();
    await allocation.save();

    res.json({ message: "Slot exited successfully", allocation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all slots with vehicle details
router.get("/", async (req, res) => {
  try {
    const allocations = await SlotAllocation.find().populate("vehicle").sort({ allocationTime: -1 });
    res.json(allocations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
