const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ================================
// ROUTES
// ================================

// Taxi Requests
const taxiRequestRoutes = require("./routes/taxiRequest");
app.use("/api/taxi-requests", taxiRequestRoutes); // mounted correctly

// Taxi & Driver Routes
const taxiRoutes = require("./routes/taxi");
app.use("/api/taxis", taxiRoutes);

const driverRoutes = require("./routes/driver");
app.use("/api/drivers", driverRoutes);

// ================================
// MONGO CONNECTION
// ================================
mongoose
  .connect("mongodb://127.0.0.1:27017/hotelDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// ================================
// VEHICLE SCHEMA & MODEL
// ================================
const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, required: true },
    nic: { type: String, required: true },
    guestName: { type: String, required: true },
    guestAddress: { type: String, required: true },
    contactNumber: { type: String, required: true },
    vehicleNumber: { type: String, required: true, unique: true },
    vehicleType: { type: String, required: true },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

// ================================
// SLOT ALLOCATION SCHEMA & MODEL
// ================================
const slotAllocationSchema = new mongoose.Schema(
  {
    slotNumber: { type: Number, required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    allocateStatus: { type: String, enum: ["allocated", "available"], default: "allocated" },
    allocationTime: { type: Date, default: Date.now },
    exitTime: { type: Date, default: null },
  },
  { timestamps: true }
);

const SlotAllocation = mongoose.model("SlotAllocation", slotAllocationSchema);

// ================================
// VEHICLE ROUTES
// ================================

// GET all vehicles
app.get("/api/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json({ success: true, vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching vehicles", error: err.message });
  }
});

// CREATE vehicle
app.post("/api/vehicles", async (req, res) => {
  try {
    const { nic, guestName, guestAddress, contactNumber, vehicleNumber, vehicleType } = req.body;
    if (!nic || !guestName || !guestAddress || !contactNumber || !vehicleNumber || !vehicleType) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const exists = await Vehicle.findOne({ vehicleNumber });
    if (exists) return res.status(400).json({ success: false, message: "Vehicle already exists" });

    const registrationNumber = "REG-" + Math.floor(100000 + Math.random() * 900000);

    const vehicle = new Vehicle({
      registrationNumber,
      nic,
      guestName,
      guestAddress,
      contactNumber,
      vehicleNumber,
      vehicleType,
    });

    const savedVehicle = await vehicle.save();
    res.status(201).json({ success: true, vehicle: savedVehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error while saving vehicle", error: err.message });
  }
});

// UPDATE vehicle
app.put("/api/vehicles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nic, guestName, guestAddress, contactNumber, vehicleNumber, vehicleType } = req.body;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

    vehicle.nic = nic || vehicle.nic;
    vehicle.guestName = guestName || vehicle.guestName;
    vehicle.guestAddress = guestAddress || vehicle.guestAddress;
    vehicle.contactNumber = contactNumber || vehicle.contactNumber;
    vehicle.vehicleNumber = vehicleNumber || vehicle.vehicleNumber;
    vehicle.vehicleType = vehicleType || vehicle.vehicleType;

    const updatedVehicle = await vehicle.save();
    res.json({ success: true, vehicle: updatedVehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update vehicle", error: err.message });
  }
});

// DELETE vehicle
app.delete("/api/vehicles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

    res.json({ success: true, message: "Vehicle deleted successfully", vehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete vehicle", error: err.message });
  }
});

// ================================
// SLOT ALLOCATION ROUTES
// ================================

// GET all slot allocations
app.get("/api/slots", async (req, res) => {
  try {
    const slots = await SlotAllocation.find().populate("vehicle").sort({ allocationTime: -1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Error fetching slots", error: err.message });
  }
});

// ALLOCATE slot
app.post("/api/slots/allocate", async (req, res) => {
  try {
    const { slotNumber, vehicleId } = req.body;
    if (!slotNumber || !vehicleId) return res.status(400).json({ message: "Slot number and vehicle ID are required" });

    const existing = await SlotAllocation.findOne({ slotNumber, exitTime: null });
    if (existing) return res.status(400).json({ message: "Slot already allocated" });

    const allocation = new SlotAllocation({
      slotNumber,
      vehicle: vehicleId,
      allocateStatus: "allocated",
      allocationTime: new Date(),
    });

    await allocation.save();
    res.status(201).json({ message: "Slot allocated successfully", allocation });
  } catch (err) {
    res.status(500).json({ message: "Server error while allocating slot", error: err.message });
  }
});

// EXIT slot
app.post("/api/slots/exit", async (req, res) => {
  try {
    const { slotNumber } = req.body;
    if (!slotNumber) return res.status(400).json({ message: "Slot number is required" });

    const allocation = await SlotAllocation.findOne({ slotNumber, exitTime: null }).sort({ allocationTime: -1 });
    if (!allocation) return res.status(404).json({ message: "No active allocation found for this slot" });

    allocation.exitTime = new Date();
    allocation.allocateStatus = "available";
    await allocation.save();

    res.json({ message: `Slot ${slotNumber} exited successfully`, allocation });
  } catch (err) {
    res.status(500).json({ message: "Server error while exiting slot", error: err.message });
  }
});

const taxiAllocationRoutes = require("./routes/taxi-allocation");
app.use("/api/taxi-allocation", taxiAllocationRoutes);



// ================================
// START SERVER
// ================================
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
