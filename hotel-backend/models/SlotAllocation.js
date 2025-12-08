import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SidebarLayout from "../../layout/SidebarLayout";
import { MdLocalParking } from "react-icons/md";

export default function SlotAllocation() {
  const [slots, setSlots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    vehicleId: "",
    registrationNumber: "",
    guestName: "",
    guestAddress: "",
    contactNumber: "",
    vehicleNumber: "",
    vehicleType: "",
  });

  // Fetch vehicles
  useEffect(() => {
    axios.get("http://localhost:5000/api/vehicles")
      .then(res => setVehicles(res.data))
      .catch(() => Swal.fire("Error", "Failed to load vehicles", "error"));
  }, []);

  // Fetch slots
  const fetchSlots = () => {
    axios.get("http://localhost:5000/api/slots")
      .then(res => {
        const slotArray = Array.from({ length: 20 }, (_, i) => {
          const existing = res.data.find(s => s.slotNumber === i + 1);
          return existing ? existing : { slotNumber: i + 1, allocateStatus: "available" };
        });
        setSlots(slotArray);
      })
      .catch(() => Swal.fire("Error", "Failed to load slots", "error"));
  };

  useEffect(() => { fetchSlots(); }, []);

  // Vehicle selection auto-fill
  const handleVehicleSelect = (e) => {
    const vehicleId = e.target.value;
    const vehicle = vehicles.find(v => v._id === vehicleId);
    if (vehicle) {
      setFormData({
        vehicleId: vehicle._id,
        registrationNumber: vehicle.registrationNumber,
        guestName: vehicle.guestName,
        guestAddress: vehicle.guestAddress,
        contactNumber: vehicle.contactNumber,
        vehicleNumber: vehicle.vehicleNumber,
        vehicleType: vehicle.vehicleType,
      });
    } else {
      setFormData({ ...formData, vehicleId: "" });
    }
  };

  // Allocate slot
  const allocateSlot = async () => {
    if (!formData.vehicleId) return Swal.fire("Warning", "Select a vehicle", "warning");
    try {
      await axios.post("http://localhost:5000/api/slots/allocate", {
        slotNumber: selectedSlot.slotNumber,
        vehicleId: formData.vehicleId,
      });
      Swal.fire("Success", `Slot ${selectedSlot.slotNumber} allocated`, "success");
      setSelectedSlot(null);
      setFormData({
        vehicleId: "",
        registrationNumber: "",
        guestName: "",
        guestAddress: "",
        contactNumber: "",
        vehicleNumber: "",
        vehicleType: "",
      });
      fetchSlots();
    } catch {
      Swal.fire("Error", "Slot allocation failed", "error");
    }
  };

  // Exit slot
  const exitSlot = async (slotNumber) => {
    try {
      await axios.post("http://localhost:5000/api/slots/exit", { slotNumber });
      Swal.fire("Success", `Slot ${slotNumber} exited`, "success");
      fetchSlots();
    } catch {
      Swal.fire("Error", "Failed to exit slot", "error");
    }
  };

  return (
    <SidebarLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Parking Slot Allocation</h1>

        {/* Slots Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
          {slots.map(slot => (
            <div key={slot.slotNumber} className={`p-4 rounded-lg shadow-lg flex flex-col items-center justify-center ${
              slot.allocateStatus === "allocated" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}>
              <MdLocalParking size={40} className="mb-2" />
              <p className="font-semibold">Slot {slot.slotNumber}</p>
              <p className="text-sm capitalize mb-2">{slot.allocateStatus}</p>
              {slot.allocateStatus === "allocated" && slot.vehicle ? (
                <>
                  <p className="text-xs">Owner: {slot.vehicle.guestName}</p>
                  <p className="text-xs">Reg No: {slot.vehicle.vehicleNumber}</p>
                  <p className="text-xs">Allocated: {new Date(slot.allocationTime).toLocaleString()}</p>
                  {slot.exitTime && <p className="text-xs">Exited: {new Date(slot.exitTime).toLocaleString()}</p>}
                  <button onClick={() => exitSlot(slot.slotNumber)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 mt-2">Exit</button>
                </>
              ) : (
                <button onClick={() => setSelectedSlot(slot)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Allocate</button>
              )}
            </div>
          ))}
        </div>

        {/* Allocate Modal */}
        {selectedSlot && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-20" onClick={() => setSelectedSlot(null)}></div>
            <div className="bg-white p-6 rounded-lg w-96 z-50">
              <h2 className="text-xl font-bold mb-4">Allocate Slot {selectedSlot.slotNumber}</h2>

              <select className="w-full border px-3 py-2 rounded mb-4" value={formData.vehicleId} onChange={handleVehicleSelect}>
                <option value="">Select Vehicle</option>
                {vehicles.map(v => (
                  <option key={v._id} value={v._id}>{v.vehicleNumber} ({v.guestName})</option>
                ))}
              </select>

              {/* Auto-filled fields */}
              <input type="text" value={formData.registrationNumber} readOnly placeholder="Registration Number" className="w-full border px-3 py-2 rounded mb-2" />
              <input type="text" value={formData.guestName} readOnly placeholder="Owner Name" className="w-full border px-3 py-2 rounded mb-2" />
              <input type="text" value={formData.contactNumber} readOnly placeholder="Contact Number" className="w-full border px-3 py-2 rounded mb-2" />
              <input type="text" value={formData.guestAddress} readOnly placeholder="Address" className="w-full border px-3 py-2 rounded mb-2" />
              <input type="text" value={formData.vehicleType} readOnly placeholder="Vehicle Type" className="w-full border px-3 py-2 rounded mb-2" />

              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => setSelectedSlot(null)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={allocateSlot} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Allocate</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
