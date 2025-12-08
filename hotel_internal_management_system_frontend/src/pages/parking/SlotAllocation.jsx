// SlotAllocation.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SidebarLayout from "../../layout/SidebarLayout";
import { MdLocalParking } from "react-icons/md";

export default function SlotAllocation() {
  const TOTAL_SLOTS = 20;

  const [vehicles, setVehicles] = useState([]);
  const [allocations, setAllocations] = useState([]); // all allocation rows from backend
  const [slots, setSlots] = useState([]); // derived current view for 20 slots
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

  // Load vehicles and allocations
  useEffect(() => {
    fetchVehicles();
    fetchAllocations();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vehicles");
      setVehicles(res.data.vehicles || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load vehicles", "error");
    }
  };

  const fetchAllocations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/slots");
      const allAlloc = res.data || []; // <-- use res.data directly
      setAllocations(allAlloc);
      buildSlotsFromAllocations(allAlloc);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load allocations", "error");
    }
  };

  // Build display slots: for each 1..TOTAL_SLOTS find the latest allocation row
  const buildSlotsFromAllocations = (allAlloc) => {
    const slotArray = Array.from({ length: TOTAL_SLOTS }, (_, i) => {
      const slotNumber = i + 1;

      // Get allocations for this slot and sort by allocationTime
      const allocationsForSlot = allAlloc
        .filter(a => a.slotNumber === slotNumber)
        .sort((a, b) => new Date(b.allocationTime) - new Date(a.allocationTime));

      if (allocationsForSlot.length === 0) {
        return { slotNumber, allocateStatus: "available", vehicle: null, allocationTime: null, exitTime: null };
      }

      const latest = allocationsForSlot[0];
      return {
        slotNumber,
        allocateStatus: latest.allocateStatus,
        vehicle: latest.vehicle || null,
        allocationTime: latest.allocationTime,
        exitTime: latest.exitTime || null,
        allocationId: latest._id,
      };
    });

    setSlots(slotArray);
  };

  const openAllocateModal = (slot) => {
    setSelectedSlot(slot);
    setFormData({
      vehicleId: "",
      registrationNumber: "",
      guestName: "",
      guestAddress: "",
      contactNumber: "",
      vehicleNumber: "",
      vehicleType: "",
    });
  };

  const handleVehicleSelect = (e) => {
    const vehicleId = e.target.value;
    const vehicle = vehicles.find(v => v._id === vehicleId);
    if (vehicle) {
      setFormData({
        vehicleId: vehicle._id,
        registrationNumber: vehicle.registrationNumber || "",
        guestName: vehicle.guestName || "",
        guestAddress: vehicle.guestAddress || "",
        contactNumber: vehicle.contactNumber || "",
        vehicleNumber: vehicle.vehicleNumber || "",
        vehicleType: vehicle.vehicleType || "",
      });
    } else {
      setFormData({
        vehicleId: "",
        registrationNumber: "",
        guestName: "",
        guestAddress: "",
        contactNumber: "",
        vehicleNumber: "",
        vehicleType: "",
      });
    }
  };

  const allocateSlot = async () => {
    if (!formData.vehicleId) return Swal.fire("Warning", "Select a vehicle", "warning");
    if (!selectedSlot) return Swal.fire("Error", "No slot selected", "error");

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
      fetchAllocations();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Slot allocation failed";
      Swal.fire("Error", msg, "error");
    }
  };

  const exitSlot = async (slotNumber) => {
    try {
      const confirm = await Swal.fire({
        title: `Exit Slot ${slotNumber}?`,
        text: "Mark allocation as exited",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, exit",
      });
      if (!confirm.isConfirmed) return;

      await axios.post("http://localhost:5000/api/slots/exit", { slotNumber });
      Swal.fire("Success", `Slot ${slotNumber} exited`, "success");
      fetchAllocations();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to exit slot";
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <SidebarLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Parking Slot Allocation</h1>

        {/* Slots Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
          {slots.map(slot => (
            <div
              key={slot.slotNumber}
              className={`p-4 rounded-lg shadow-lg flex flex-col items-center justify-center ${
                slot.allocateStatus === "allocated" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
              }`}
            >
              <MdLocalParking size={40} className="mb-2" />
              <p className="font-semibold">Slot {slot.slotNumber}</p>
              <p className="text-sm capitalize mb-2">{slot.allocateStatus}</p>

              {slot.allocateStatus === "allocated" && slot.vehicle ? (
                <>
                  <p className="text-xs">Owner: {slot.vehicle.guestName}</p>
                  <p className="text-xs">Vehicle No: {slot.vehicle.vehicleNumber}</p>
                  <p className="text-xs">Reg No: {slot.vehicle.registrationNumber}</p>
                  {slot.allocationTime && <p className="text-xs">Allocated: {new Date(slot.allocationTime).toLocaleString()}</p>}
                  {slot.exitTime && <p className="text-xs">Exited: {new Date(slot.exitTime).toLocaleString()}</p>}
                  <button onClick={() => exitSlot(slot.slotNumber)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 mt-2">Exit</button>
                </>
              ) : (
                <button onClick={() => openAllocateModal(slot)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Allocate</button>
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

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Number (select)</label>
                  <select value={formData.vehicleId} onChange={handleVehicleSelect} className="w-full border px-3 py-2 rounded">
                    <option value="">Select Vehicle</option>
                    {vehicles.map(v => (
                      <option key={v._id} value={v._id}>{v.vehicleNumber} — {v.guestName}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">If your vehicle is missing, register it first in Vehicles.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Registration Number</label>
                  <input readOnly value={formData.registrationNumber} className="w-full border px-3 py-2 rounded bg-gray-100" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Contact Number</label>
                  <input readOnly value={formData.contactNumber} className="w-full border px-3 py-2 rounded bg-gray-100" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input readOnly value={formData.guestAddress} className="w-full border px-3 py-2 rounded bg-gray-100" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                  <input readOnly value={formData.vehicleType} className="w-full border px-3 py-2 rounded bg-gray-100" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Guest Name</label>
                  <input readOnly value={formData.guestName} className="w-full border px-3 py-2 rounded bg-gray-100" />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => setSelectedSlot(null)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={allocateSlot} disabled={!formData.vehicleId} className={`px-4 py-2 text-white rounded ${formData.vehicleId ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}>
                  Allocate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
