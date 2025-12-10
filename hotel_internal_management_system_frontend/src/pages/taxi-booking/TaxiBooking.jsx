import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SidebarLayout from "../../layout/SidebarLayout";

const API_REQUESTS = "http://localhost:5000/api/taxi-requests";
const API_ALLOCATION = "http://localhost:5000/api/taxi-allocation";
const API_DRIVERS = "http://localhost:5000/api/drivers";

export default function TaxiBooking() {
  const [requests, setRequests] = useState([]);
  const [availableTaxis, setAvailableTaxis] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState("");
  const [selectedTaxi, setSelectedTaxi] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      const res = await axios.get(API_REQUESTS);
      setRequests(res.data.filter(r => r.status === "Pending"));
    } catch (err) { console.error(err); }
  };

  const openAssignModal = async (reqId) => {
    const request = requests.find(r => r._id === reqId);
    if (!request) return;

    setSelectedRequest(reqId);

    // Fetch taxis and drivers
    const taxisRes = await axios.get(`${API_ALLOCATION}/available-taxis`);
    setAvailableTaxis(taxisRes.data);

    const driversRes = await axios.get(`${API_ALLOCATION}/available-drivers`);
    setAvailableDrivers(driversRes.data);

    setSelectedTaxi("");
    setSelectedDriver("");
    setFromDate(request.fromDate ? request.fromDate.split("T")[0] : "");
    setToDate(request.toDate ? request.toDate.split("T")[0] : "");
    setShowModal(true);
  };

  const assignTaxi = async () => {
    if (!selectedTaxi || !selectedDriver || !fromDate || !toDate) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    try {
      await axios.post(`${API_ALLOCATION}/assign`, {
        requestId: selectedRequest,
        taxiId: selectedTaxi,
        driverId: selectedDriver,
        allocatedFrom: new Date(fromDate),
        allocatedTo: new Date(toDate),
      });

      Swal.fire("Success", "Taxi allocation saved!", "success");
      setShowModal(false);
      loadRequests();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || "Server error", "error");
    }
  };

  const formatDate = (date) => date ? new Date(date).toISOString().split("T")[0] : "";

  return (
    <SidebarLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Taxi Booking Requests</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(req => (
            <div key={req._id} className="border p-5 rounded-xl shadow-md bg-white">
              <h3 className="text-xl font-semibold mb-2">{req.customerName}</h3>
              <p><strong>Pickup:</strong> {req.pickupLocation}</p>
              <p><strong>Drop:</strong> {req.dropLocation}</p>
              <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded" onClick={() => openAssignModal(req._id)}>
                Assign Taxi
              </button>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
              <h2 className="text-lg font-bold mb-4">Assign Taxi & Driver</h2>

              <label>Taxi:</label>
              <select value={selectedTaxi} onChange={e => setSelectedTaxi(e.target.value)} className="w-full border p-2 rounded mb-3">
                <option value="">-- Select Taxi --</option>
                {availableTaxis.map(t => <option key={t._id} value={t._id}>{t.taxiNumber} ({t.taxiType})</option>)}
              </select>

              <label>Driver:</label>
              <select value={selectedDriver} onChange={e => setSelectedDriver(e.target.value)} className="w-full border p-2 rounded mb-3">
                <option value="">-- Select Driver --</option>
                {availableDrivers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>

              <label>From Date:</label>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-full border p-2 rounded mb-3" />

              <label>To Date:</label>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-full border p-2 rounded mb-3" />

              <div className="flex justify-between mt-4">
                <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={assignTaxi}>Assign</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
