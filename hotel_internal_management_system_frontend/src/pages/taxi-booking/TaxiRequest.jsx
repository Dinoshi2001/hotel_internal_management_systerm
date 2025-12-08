import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SidebarLayout from "../../layout/SidebarLayout";
import { MdEdit, MdDelete } from "react-icons/md";

const API = "http://localhost:5000/api/taxi-requests";

export default function TaxiRequest() {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    pickupLocation: "",
    dropLocation: "",
    taxiType: "",
    seatsRequired: "",
    fromDate: "",
    toDate: "",
    daysRequired: "",
    status: "Pending",
  });

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(API);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Calculate daysRequired automatically if fromDate or toDate changes
    if (name === "fromDate" || name === "toDate") {
      const from = new Date(updatedData.fromDate);
      const to = new Date(updatedData.toDate);
      if (from && to && to >= from) {
        const diffTime = Math.abs(to - from);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // include both days
        updatedData.daysRequired = diffDays;
      } else {
        updatedData.daysRequired = "";
      }
    }

    setFormData(updatedData);
  };

  const handleEdit = (request) => {
    setFormData({
      customerName: request.customerName,
      phone: request.phone,
      pickupLocation: request.pickupLocation,
      dropLocation: request.dropLocation,
      taxiType: request.taxiType,
      seatsRequired: request.seatsRequired,
      fromDate: request.fromDate ? request.fromDate.split("T")[0] : "",
      toDate: request.toDate ? request.toDate.split("T")[0] : "",
      daysRequired: request.daysRequired,
      status: request.status,
    });
    setEditId(request._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This request will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API}/${id}`);
        Swal.fire("Deleted!", "Request has been deleted.", "success");
        fetchRequests();
      } catch (err) {
        Swal.fire("Error", "Failed to delete request", "error");
      }
    }
  };

  const saveRequest = async () => {
    if (
      !formData.customerName ||
      !formData.phone ||
      !formData.pickupLocation ||
      !formData.dropLocation ||
      !formData.taxiType ||
      !formData.seatsRequired ||
      !formData.fromDate ||
      !formData.toDate
    ) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    const result = await Swal.fire({
      title: editId ? "Confirm Update" : "Confirm Booking",
      text: editId
        ? "Do you want to update this taxi request?"
        : "Do you want to submit this taxi request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: editId ? "Yes, update" : "Yes, submit",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        if (editId) {
          await axios.put(`${API}/${editId}`, formData);
          Swal.fire("Success", "Taxi request updated successfully", "success");
        } else {
          await axios.post(API, formData);
          Swal.fire("Success", "Taxi request submitted successfully", "success");
        }

        fetchRequests();
        setShowModal(false);
        setEditId(null);
        setFormData({
          customerName: "",
          phone: "",
          pickupLocation: "",
          dropLocation: "",
          taxiType: "",
          seatsRequired: "",
          fromDate: "",
          toDate: "",
          daysRequired: "",
          status: "Pending",
        });
      } catch (err) {
        Swal.fire("Error", "Failed to submit/update request", "error");
      }
    }
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => (date ? new Date(date).toISOString().split("T")[0] : "");

  return (
    <SidebarLayout>
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Taxi Booking Requests</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setShowModal(true)}
          >
            + New Request
          </button>
        </div>

        <div className="bg-white shadow rounded p-4 overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Pickup</th>
                <th className="p-2 border">Drop</th>
                <th className="p-2 border">Taxi Type</th>
                <th className="p-2 border">Seats</th>
                <th className="p-2 border">From Date</th>
                <th className="p-2 border">To Date</th>
                <th className="p-2 border">Days</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="border-b">
                  <td className="p-2 border">{r.customerName}</td>
                  <td className="p-2 border">{r.phone}</td>
                  <td className="p-2 border">{r.pickupLocation}</td>
                  <td className="p-2 border">{r.dropLocation}</td>
                  <td className="p-2 border">{r.taxiType}</td>
                  <td className="p-2 border">{r.seatsRequired}</td>
                  <td className="p-2 border">{formatDate(r.fromDate)}</td>
                  <td className="p-2 border">{formatDate(r.toDate)}</td>
                  <td className="p-2 border">{r.daysRequired}</td>
                  <td className="p-2 border">{r.status}</td>
                  <td className="p-2 border flex gap-2">
                    <MdEdit
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      size={22}
                      onClick={() => handleEdit(r)}
                    />
                    <MdDelete
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      size={22}
                      onClick={() => handleDelete(r._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-bold mb-3">
                {editId ? "Edit Taxi Request" : "Add Taxi Request"}
              </h3>

              <input
                type="text"
                name="customerName"
                placeholder="Customer Name"
                className="border p-2 w-full mb-2"
                value={formData.customerName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="border p-2 w-full mb-2"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                type="text"
                name="pickupLocation"
                placeholder="Pickup Location"
                className="border p-2 w-full mb-2"
                value={formData.pickupLocation}
                onChange={handleChange}
              />
              <input
                type="text"
                name="dropLocation"
                placeholder="Drop Location"
                className="border p-2 w-full mb-2"
                value={formData.dropLocation}
                onChange={handleChange}
              />
              <select
                name="taxiType"
                className="border p-2 w-full mb-2"
                value={formData.taxiType}
                onChange={handleChange}
              >
                <option value="">Select Taxi Type</option>
                <option value="Car">Car</option>
                <option value="Van">Van</option>
                <option value="Three-Wheeler">Three-Wheeler</option>
              </select>
              <input
                type="number"
                name="seatsRequired"
                placeholder="Number of Seats Needed"
                className="border p-2 w-full mb-2"
                value={formData.seatsRequired}
                onChange={handleChange}
              />
              <label className="text-sm mb-1 block">From Date:</label>
              <input
                type="date"
                name="fromDate"
                className="border p-2 w-full mb-2"
                value={formData.fromDate}
                onChange={handleChange}
              />
              <label className="text-sm mb-1 block">To Date:</label>
              <input
                type="date"
                name="toDate"
                className="border p-2 w-full mb-2"
                value={formData.toDate}
                onChange={handleChange}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={saveRequest}
                >
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
