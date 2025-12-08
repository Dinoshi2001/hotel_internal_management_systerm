import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layout/SidebarLayout";
import Swal from "sweetalert2";
import { MdEdit, MdDelete } from "react-icons/md";

export default function DriverManagement() {
  const [drivers, setDrivers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    vehicleType: "",
    address: "",
  });

  // Load drivers from backend
  const fetchDrivers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/drivers");
      const data = await res.json();
      setDrivers(data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open modal for editing
  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      vehicleType: driver.vehicleType || "",
      address: driver.address || "",
    });
    setModalOpen(true);
  };

  // Delete driver
  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete driver?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:5000/api/drivers/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete");
          Swal.fire("Deleted!", "Driver has been deleted.", "success");
          fetchDrivers();
        } catch (error) {
          Swal.fire("Error", "Server error", "error");
        }
      }
    });
  };

  // Save driver (add or edit)
  const saveDriver = async () => {
    if (!formData.name || !formData.phone || !formData.licenseNumber) {
      Swal.fire("Error", "Name, Phone & License Number are required", "error");
      return;
    }

    const method = editingDriver ? "PUT" : "POST";
    const url = editingDriver
      ? `http://localhost:5000/api/drivers/${editingDriver._id}`
      : "http://localhost:5000/api/drivers";

    Swal.fire({
      title: editingDriver ? "Update driver?" : "Add driver?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: editingDriver ? "Update" : "Save",
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
            Swal.fire("Error", resultData.message, "error");
            return;
          }

          Swal.fire(
            "Success",
            editingDriver ? "Driver updated!" : "Driver added!",
            "success"
          );

          setFormData({
            name: "",
            phone: "",
            licenseNumber: "",
            vehicleType: "",
            address: "",
          });
          setEditingDriver(null);
          setModalOpen(false);
          fetchDrivers();
        } catch (error) {
          Swal.fire("Error", "Server error", "error");
        }
      }
    });
  };

  return (
    <SidebarLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Driver Management</h1>

        <button
          onClick={() => {
            setModalOpen(true);
            setEditingDriver(null);
            setFormData({
              name: "",
              phone: "",
              licenseNumber: "",
              vehicleType: "",
              address: "",
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Driver
        </button>

        <table className="w-full mt-6 bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">License No</th>
              <th className="p-3">Vehicle Type</th>
              <th className="p-3">Address</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((d, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{d.name}</td>
                <td className="p-3">{d.phone}</td>
                <td className="p-3">{d.licenseNumber}</td>
                <td className="p-3">{d.vehicleType || "-"}</td>
                <td className="p-3">{d.address || "-"}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(d._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {modalOpen && (
          <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">
                {editingDriver ? "Edit Driver" : "Add New Driver"}
              </h2>

              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-2 font-semibold">Name:</td>
                    <td className="py-2">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 font-semibold">Phone:</td>
                    <td className="py-2">
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 font-semibold">License No:</td>
                    <td className="py-2">
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 font-semibold">Vehicle Type:</td>
                    <td className="py-2">
                      <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select Vehicle Type</option>
                        <option value="Car">Car</option>
                        <option value="Van">Van</option>
                        <option value="Bus">Bus</option>
                        <option value="Bike">Bike</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 font-semibold">Address:</td>
                    <td className="py-2">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      />
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
                  onClick={saveDriver}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingDriver ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
