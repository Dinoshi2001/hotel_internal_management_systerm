import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed">
      <h2 className="text-2xl font-bold mb-6">Hotel IMS</h2>

      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="hover:text-blue-400">
          🅿 Parking Dashboard
        </Link>
        <Link to="/slot-allocation" className="hover:text-blue-400">
          🚗 Slot Allocation
        </Link>
        <Link to="/vehicle-registration" className="hover:text-blue-400">
          📋 Vehicle Registration
        </Link>
        <Link to="/entry-exit" className="hover:text-blue-400">
          🔄 Entry / Exit Log
        </Link>
      </nav>
    </div>
  );
}
