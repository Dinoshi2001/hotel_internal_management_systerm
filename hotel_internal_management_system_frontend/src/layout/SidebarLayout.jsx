import React from "react";
import { Link } from "react-router-dom";
import { MdTaxiAlert } from "react-icons/md";

import {
  MdDashboard,
  MdLocalParking,
  MdDirectionsCar,
  MdHistory,

  MdRoute,
  MdPerson,
    MdCarRental ,
  MdAttachMoney
} from "react-icons/md";

export default function SidebarLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h1 className="text-xl font-bold tracking-wide">
          Hotel Admin Panel
        </h1>

        <nav className="space-y-4">

          {/* MAIN DASHBOARD */}
          <Link to="/dashboard" className="flex items-center space-x-3 hover:text-blue-300">
            <MdDashboard size={22} />
            <span>Dashboard</span>
          </Link>

          {/* VEHICLE PARKING MANAGEMENT */}
          <h2 className="text-sm text-gray-400 mt-6 uppercase">Parking Management</h2>

          

          <Link to="/slot-allocation" className="flex items-center gap-3 p-2 hover:bg-gray-200">
            <MdDirectionsCar size={22} />
            <span>Slot Allocation</span>
          </Link>

          <Link
  to="/guest-vehicle-registration"
  className="flex items-center gap-3 p-2 hover:bg-gray-200"
>
            <MdPerson size={22} />
            <span>Guest / Vehicle Registration</span>
          </Link>

       

     <Link
  to="/entry-exit-logs"
  className="flex items-center gap-3 p-2 hover:bg-gray-200"
>
  <MdDirectionsCar size={22} />
  <span>Entry / Exit Logs</span>
</Link>


        
        

          {/* TAXI & TRANSPORT MANAGEMENT */}
          <h2 className="text-sm text-gray-400 mt-6 uppercase">Taxi & Transport</h2>

          <Link to="/taxi/drivers" className="flex items-center space-x-3 hover:text-blue-300">
  <MdPerson size={22} />
  <span>Driver Management</span>
</Link>
<Link to="/taxi/management" className="flex items-center space-x-3 hover:text-blue-300">
            <MdCarRental size={22} />
            <span>Taxi Management</span>
          </Link>

        <Link
    to="/taxi-request"
    className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
  >
    <MdTaxiAlert className="text-xl" />
    Taxi Request
  </Link>


        

         <Link
  to="/taxi-booking"
  className="block px-4 py-2 hover:bg-gray-200"
>
  Taxi Booking
</Link>

          

        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
