import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SidebarLayout from "../../layout/SidebarLayout"; // ← Sidebar included!

const API_REQUESTS = "http://localhost:5000/api/taxi-requests";
const API_ASSIGN = "http://localhost:5000/api/taxi-requests/assign";

export default function TaxiBooking() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await axios.get(API_REQUESTS);
      setRequests(res.data.filter((r) => r.status === "Pending"));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  const assignTaxi = async (id) => {
    const confirm = await Swal.fire({
      title: "Assign Taxi?",
      text: "System will automatically assign an available taxi.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, assign"
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.put(`${API_ASSIGN}/${id}`);
      Swal.fire("Success", "Taxi Assigned Successfully!", "success");
      loadRequests();
    } catch (err) {
      Swal.fire("Error", err.response.data.error, "error");
    }
  };

  return (
    <SidebarLayout>
      <div className="p-6">

        <h2 className="text-xl font-bold mb-6">Taxi Booking Requests</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {requests.map((req) => (
            <div
              key={req._id}
              className="border rounded-xl shadow-md bg-white p-5 transition transform hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {req.customerName}
                </h3>
                <p className="text-gray-500 text-sm">Booking Request</p>
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                <p><strong className="text-gray-900">Phone:</strong> {req.phone}</p>
                <p><strong className="text-gray-900">Pickup:</strong> {req.pickupLocation}</p>
                <p><strong className="text-gray-900">Drop:</strong> {req.dropLocation}</p>
                <p><strong className="text-gray-900">Taxi Type:</strong> {req.taxiType}</p>
                <p><strong className="text-gray-900">Seats Needed:</strong> {req.seatsRequired}</p>
                <p><strong className="text-gray-900">From:</strong> {formatDate(req.fromDate)}</p>
                <p><strong className="text-gray-900">To:</strong> {formatDate(req.toDate)}</p>
                <p><strong className="text-gray-900">Days:</strong> {req.daysRequired}</p>
              </div>

              <button
                className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                onClick={() => assignTaxi(req._id)}
              >
                Assign Taxi
              </button>
            </div>
          ))}

        </div>
      </div>
    </SidebarLayout>
  );
}
