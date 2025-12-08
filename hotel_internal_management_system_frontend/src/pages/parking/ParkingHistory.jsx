import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layout/SidebarLayout";

export default function ParkingHistory() {
  // Sample parking history data
  const [history, setHistory] = useState([
    {
      id: 1,
      guestName: "John Doe",
      vehicleNumber: "AB-1234",
      slot: "A1",
      entryTime: "2025-11-19 08:30",
      exitTime: "2025-11-19 12:45",
    },
    {
      id: 2,
      guestName: "Jane Smith",
      vehicleNumber: "CD-5678",
      slot: "A2",
      entryTime: "2025-11-19 09:15",
      exitTime: "2025-11-19 13:00",
    },
    {
      id: 3,
      guestName: "Bob Brown",
      vehicleNumber: "EF-9012",
      slot: "B1",
      entryTime: "2025-11-19 10:00",
      exitTime: "2025-11-19 14:30",
    },
  ]);

  return (
    <SidebarLayout>
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Parking History</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Guest Name</th>
                <th className="px-4 py-2 border">Vehicle Number</th>
                <th className="px-4 py-2 border">Slot</th>
                <th className="px-4 py-2 border">Entry Time</th>
                <th className="px-4 py-2 border">Exit Time</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No parking records found
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{record.guestName}</td>
                    <td className="border px-4 py-2">{record.vehicleNumber}</td>
                    <td className="border px-4 py-2">{record.slot}</td>
                    <td className="border px-4 py-2">{record.entryTime}</td>
                    <td className="border px-4 py-2">{record.exitTime}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
