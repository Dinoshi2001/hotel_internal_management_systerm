const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true },
  nic: { type: String, required: true },
  guestName: { type: String, required: true },
  guestAddress: { type: String, required: true },
  contactNumber: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  vehicleType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
