import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layout/SidebarLayout";
import { MdEdit, MdDelete, MdInfo } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";

export default function GuestVehicleRegistration() {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false); // To track view mode
  const [formData, setFormData] = useState({
    id: null,
    registrationNumber: "",
    nic: "",
    guestName: "",
    guestAddress: "",
    contactNumber: "",
    vehicleNumber: "",
    vehicleType: "",
  });

  const [search, setSearch] = useState({
    registrationNumber: "",
    nic: "",
    guestName: "",
    guestAddress: "",
    contactNumber: "",
    vehicleNumber: "",
    vehicleType: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/vehicles");

    setVehicles(
      res.data.vehicles.map((v) => ({
        ...v,
        id: v._id, // Ensure table rows have unique ID
      }))
    );

  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Failed to load vehicles", "error");
  }
};


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      registrationNumber: "",
      nic: "",
      guestName: "",
      guestAddress: "",
      contactNumber: "",
      vehicleNumber: "",
      vehicleType: "",
    });
    setIsViewMode(false);
    setShowModal(false);
  };

  const validateForm = () => {
    const { nic, guestName, guestAddress, contactNumber, vehicleNumber, vehicleType } = formData;
    if (!nic || !guestName || !guestAddress || !contactNumber || !vehicleNumber || !vehicleType) {
      Swal.fire("Error", "Please fill all fields!", "error");
      return false;
    }
    if (!/^\d{10}$/.test(contactNumber)) {
      Swal.fire("Error", "Contact number must be 10 digits", "error");
      return false;
    }
    if (nic.length < 10) {
      Swal.fire("Error", "NIC must be at least 10 characters", "error");
      return false;
    }
    // Prevent duplicate vehicle numbers
    const duplicate = vehicles.find(
      (v) => v.vehicleNumber === formData.vehicleNumber && v.id !== formData.id
    );
    if (duplicate) {
      Swal.fire("Error", "This vehicle number is already registered!", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save this vehicle?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      if (formData.id) {
        const res = await axios.put(`http://localhost:5000/api/vehicles/${formData.id}`, formData);
        const updatedVehicle = { ...res.data.vehicle, id: res.data.vehicle._id };
        setVehicles(vehicles.map((v) => (v.id === formData.id ? updatedVehicle : v)));
        Swal.fire("Updated", "Vehicle updated successfully", "success");
      } else {
        const res = await axios.post("http://localhost:5000/api/vehicles", formData);
        const savedVehicle = { ...res.data.vehicle, id: res.data.vehicle._id };
        setVehicles([...vehicles, savedVehicle]);
        Swal.fire("Success", "Vehicle registered successfully!", "success");
      }
      resetForm();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save vehicle", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this vehicle?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      setVehicles(vehicles.filter((v) => v.id !== id));
      Swal.fire("Deleted!", "Vehicle deleted successfully", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete vehicle", "error");
    }
  };

  const handleEdit = (vehicle) => {
    setFormData(vehicle);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = (vehicle) => {
    setFormData(vehicle);
    setIsViewMode(true);
    setShowModal(true);
  };

  // Filtered and paginated data
  const filteredVehicles = vehicles.filter((v) =>
    (v.registrationNumber || "").toLowerCase().includes(search.registrationNumber.toLowerCase()) &&
    (v.nic || "").toLowerCase().includes(search.nic.toLowerCase()) &&
    (v.guestName || "").toLowerCase().includes(search.guestName.toLowerCase()) &&
    (v.guestAddress || "").toLowerCase().includes(search.guestAddress.toLowerCase()) &&
    (v.contactNumber || "").includes(search.contactNumber) &&
    (v.vehicleNumber || "").toLowerCase().includes(search.vehicleNumber.toLowerCase()) &&
    (search.vehicleType === "" || v.vehicleType === search.vehicleType)
  );

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stylish search box
  const searchBoxClass = "mt-1 w-full border rounded-lg px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400";

  return (
    <SidebarLayout>
      <div className="p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Guest Vehicle Registration</h1>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md transition"
          >
            + Register Vehicle
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-black opacity-30"
              onClick={resetForm}
            ></div>
            <div className="bg-white rounded-xl shadow-xl p-6 w-96 z-50">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {isViewMode ? "View Vehicle" : formData.id ? "Edit Vehicle" : "Register Vehicle"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" name="nic" placeholder="NIC Number" value={formData.nic} onChange={handleChange} className="w-full border rounded px-3 py-2" required disabled={isViewMode} />
                <input type="text" name="guestName" placeholder="Guest Name" value={formData.guestName} onChange={handleChange} className="w-full border rounded px-3 py-2" required disabled={isViewMode} />
                <input type="text" name="guestAddress" placeholder="Guest Address" value={formData.guestAddress} onChange={handleChange} className="w-full border rounded px-3 py-2" required disabled={isViewMode} />
                <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} className="w-full border rounded px-3 py-2" required disabled={isViewMode} />
                <input type="text" name="vehicleNumber" placeholder="Vehicle Number" value={formData.vehicleNumber} onChange={handleChange} className="w-full border rounded px-3 py-2" required disabled={isViewMode} />
                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full border rounded px-3 py-2" required disabled={isViewMode}>
                  <option value="">Select Vehicle Type</option>
                  <option value="Car">Car</option>
                  <option value="Motorbike">Motorbike</option>
                  <option value="Bus">Bus</option>
                </select>
                <div className="flex justify-end space-x-2 mt-3">
                  <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">Close</button>
                  {!isViewMode && (
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                      {formData.id ? "Update" : "Save"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">
                  Reg No
                  <input type="text" name="registrationNumber" value={search.registrationNumber} onChange={handleSearchChange} placeholder="Search" className={searchBoxClass} />
                </th>
                <th className="px-4 py-2 text-left">
                  NIC
                  <input type="text" name="nic" value={search.nic} onChange={handleSearchChange} placeholder="Search" className={searchBoxClass} />
                </th>
                <th className="px-4 py-2 text-left">
                  Guest Name
                  <input type="text" name="guestName" value={search.guestName} onChange={handleSearchChange} placeholder="Search" className={searchBoxClass} />
                </th>
                <th className="px-4 py-2 text-left">
                  Address
                  <input type="text" name="guestAddress" value={search.guestAddress} onChange={handleSearchChange} placeholder="Search" className={searchBoxClass} />
                </th>
                <th className="px-4 py-2 text-left">
                  Contact
                  <input type="text" name="contactNumber" value={search.contactNumber} onChange={handleSearchChange} placeholder="Search" className={searchBoxClass} />
                </th>
                <th className="px-4 py-2 text-left">
                  Vehicle No
                  <input type="text" name="vehicleNumber" value={search.vehicleNumber} onChange={handleSearchChange} placeholder="Search" className={searchBoxClass} />
                </th>
                <th className="px-4 py-2 text-left">
                  Type
                  <select name="vehicleType" value={search.vehicleType} onChange={handleSearchChange} className={searchBoxClass}>
                    <option value="">All</option>
                    <option value="Car">Car</option>
                    <option value="Motorbike">Motorbike</option>
                    <option value="Bus">Bus</option>
                  </select>
                </th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVehicles.map((v, idx) => (
                <tr key={v.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td className="px-4 py-2">{v.registrationNumber}</td>
                  <td className="px-4 py-2">{v.nic}</td>
                  <td className="px-4 py-2">{v.guestName}</td>
                  <td className="px-4 py-2">{v.guestAddress}</td>
                  <td className="px-4 py-2">{v.contactNumber}</td>
                  <td className="px-4 py-2">{v.vehicleNumber}</td>
                  <td className="px-4 py-2">{v.vehicleType}</td>
                  <td className="px-4 py-2 flex justify-center space-x-3">
                    <MdEdit onClick={() => handleEdit(v)} className="cursor-pointer text-blue-600" />
                    <MdDelete onClick={() => handleDelete(v.id)} className="cursor-pointer text-red-600" />
                    <MdInfo onClick={() => handleView(v)} className="cursor-pointer text-gray-600" />
                  </td>
                </tr>
              ))}
              {paginatedVehicles.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">No vehicles found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end mt-4 space-x-2">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="px-3 py-1 border rounded disabled:opacity-50" disabled={currentPage === 1}>Prev</button>
            <span className="px-3 py-1">{currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="px-3 py-1 border rounded disabled:opacity-50" disabled={currentPage === totalPages || totalPages === 0}>Next</button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
