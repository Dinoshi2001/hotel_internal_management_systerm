import React from "react";
import SidebarLayout from "../../layout/SidebarLayout";
import { MdLocalParking, MdDirectionsCar, MdLocalTaxi, MdTrendingUp } from "react-icons/md";

export default function Dashboard() {
  return (
    <SidebarLayout>
      <div className="p-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total Parking Slots */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4">
            <MdLocalParking size={40} className="text-blue-600" />
            <div>
              <p className="text-gray-500 text-sm">Total Parking Slots</p>
              <p className="text-2xl font-bold">50</p>
            </div>
          </div>

          {/* Available Slots */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4">
            <MdTrendingUp size={40} className="text-green-600" />
            <div>
              <p className="text-gray-500 text-sm">Available Slots</p>
              <p className="text-2xl font-bold">18</p>
            </div>
          </div>

          {/* Vehicles Parked Today */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4">
            <MdDirectionsCar size={40} className="text-orange-500" />
            <div>
              <p className="text-gray-500 text-sm">Vehicles Parked Today</p>
              <p className="text-2xl font-bold">32</p>
            </div>
          </div>

          {/* Taxi Bookings Today */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4">
            <MdLocalTaxi size={40} className="text-yellow-500" />
            <div>
              <p className="text-gray-500 text-sm">Taxi Bookings Today</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>

        </div>

        {/* Recent Activity */}
        <h2 className="text-xl font-semibold mt-10 mb-4 text-gray-700">Recent Activity</h2>

        <div className="bg-white shadow-md rounded-lg p-6">

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Vehicle No</th>
                <th className="text-left py-2">Guest Name</th>
                <th className="text-left py-2">Action</th>
                <th className="text-left py-2">Time</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-2">WP ABC 1234</td>
                <td className="py-2">John Silva</td>
                <td className="py-2 text-green-500 font-semibold">Entered</td>
                <td className="py-2">10:45 AM</td>
              </tr>

              <tr className="border-b">
                <td className="py-2">CP DDD 9923</td>
                <td className="py-2">Nimal Perera</td>
                <td className="py-2 text-red-500 font-semibold">Exited</td>
                <td className="py-2">10:10 AM</td>
              </tr>

              <tr>
                <td className="py-2">WP HJK 8765</td>
                <td className="py-2">Sajith Kumara</td>
                <td className="py-2 text-green-500 font-semibold">Entered</td>
                <td className="py-2">09:30 AM</td>
              </tr>
            </tbody>

          </table>
        </div>

      </div>
    </SidebarLayout>
  );
}
