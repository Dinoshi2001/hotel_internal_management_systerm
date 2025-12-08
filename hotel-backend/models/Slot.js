const mongoose = require("mongoose");

const slotAllocationSchema = new mongoose.Schema({
  slotNumber: { type: Number, required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  allocateStatus: { type: String, enum: ["allocated", "exited"], default: "allocated" },
  allocationTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
});

module.exports = mongoose.model("SlotAllocation", slotAllocationSchema);
