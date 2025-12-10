const mongoose = require("mongoose");

const TaxiAllocationSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaxiRequest",
    required: true,
  },
  taxiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Taxi",
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  allocatedFrom: { type: Date, required: true },
  allocatedTo: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.models.TaxiAllocation || mongoose.model("TaxiAllocation", TaxiAllocationSchema);
