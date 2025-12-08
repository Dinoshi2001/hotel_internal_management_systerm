import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layout/SidebarLayout";
import Swal from "sweetalert2";
import { MdEdit, MdDelete } from "react-icons/md";

export default function TaxiManagement() {
  const [taxis, setTaxis] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTaxi, setEditingTaxi] = useState(null);

  const [formData, setFormData] = useState({
    taxiNumber: "",
    taxiType: "",
    seats: "",
    status: "Available",
  });

  // Fetch taxis from backend
  const fetchTaxis = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/taxis");
      const data = await res.json();
      // If your API returns { success: true, taxis: [...] }, set taxis array
      setTaxis(data.taxis || []);
    } catch (err) {
      console.error("Error fetching taxis:", err);
    }
  };

  useEffect(() => {
    fetchTaxis();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveTaxi = async () => {
    if (!formData.taxiNumber || !formData.taxiType || !formData.seats) {
      Swal.fire("Error", "Taxi Number, Type & Seats are required", "error");
      return;
    }

    const method = editingTaxi ? "PUT" : "POST";
    const url = editingTaxi
      ? `http://localhost:5000/api/taxis/${editingTaxi._id}`
      : "http://localhost:5000/api/taxis";

    Swal.fire({
      title: editingTaxi ? "Update Taxi?" : "Add Taxi?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: editingTaxi ? "Update" : "Save",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          const resultData = await res.json();

          if (!res.ok) {
            Swal.fire("Error", resultData.message || "Error saving taxi", "error");
            return;
          }

          Swal.fire(
            "Success",
            editingTaxi ? "Taxi updated!" : "Taxi added!",
            "success"
          );

          setFormData({
            taxiNumber: "",
            taxiType: "",
            seats: "",
            status: "Available",
          });
          setEditingTaxi(null);
          setModalOpen(false);
          fetchTaxis();
        } catch (err) {
          Swal.fire("Error", "Server error", "error");
        }
      }
    });
  };

  const handleEdit = (taxi) => {
    setEditingTaxi(taxi);
    setFormData({
      taxiNumber: taxi.taxiNumber,
      taxiType: taxi.taxiType,
      seats: taxi.seats,
      status: taxi.status,
    });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete taxi?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://localhost:5000/api/taxis/${id}`, { method: "DELETE" });
          Swal.fire("Deleted!", "Taxi has been deleted.", "success");
          fetchTaxis();
        } catch (err) {
          Swal.fire("Error", "Server error", "error");
        }
      }
    });
  };

  return (
    <SidebarLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Taxi Management</h1>

        <button
          onClick={() => {
            setModalOpen(true);
            setEditingTaxi(null);
            setFormData({ taxiNumber: "", taxiType: "", seats: "", status: "Available" });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Taxi
        </button>

        <table className="w-full mt-6 bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Taxi Number</th>
              <th className="p-3">Type</th>
              <th className="p-3">Seats</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {taxis.map((taxi, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{taxi.taxiNumber}</td>
                <td className="p-3">{taxi.taxiType}</td>
                <td className="p-3">{taxi.seats}</td>
                <td className="p-3">{taxi.status}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(taxi)} className="text-blue-600 hover:text-blue-800">
                    <MdEdit size={20} />
                  </button>
                  <button onClick={() => handleDelete(taxi._id)} className="text-red-600 hover:text-red-800">
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">{editingTaxi ? "Edit Taxi" : "Add Taxi"}</h2>

              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-2 font-semibold">Taxi Number:</td>
                    <td className="py-2">
                      <input
                        type="text"
                        name="taxiNumber"
                        value={formData.taxiNumber}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Type:</td>
                    <td className="py-2">
                      <select
                        name="taxiType"
                        value={formData.taxiType}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select Type</option>
                        <option value="Car">Car</option>
                        <option value="Van">Van</option>
                        <option value="Bus">Bus</option>
                        <option value="Bike">Bike</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Seats:</td>
                    <td className="py-2">
                      <input
                        type="number"
                        name="seats"
                        value={formData.seats}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Status:</td>
                    <td className="py-2">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      >
                        <option value="Available">Available</option>
                        <option value="On Trip">On Trip</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
                <button
                  onClick={saveTaxi}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingTaxi ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
