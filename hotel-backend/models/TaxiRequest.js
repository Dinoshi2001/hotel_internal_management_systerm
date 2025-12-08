const mongoose = require("mongoose");

const TaxiRequestSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  taxiType: { type: String, required: true },
  seatsRequired: { type: Number, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  daysRequired: { type: Number, required: true }, // automatically calculated in frontend
  status: { type: String, default: "Pending" },
}, {
  timestamps: true
});

module.exports = mongoose.model("TaxiRequest", TaxiRequestSchema);
