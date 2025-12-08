import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layout/SidebarLayout";

export default function RealTimeAvailability() {
  // Simulated parking slots
  const initialSlots = [
    { id: 1, slotNumber: "A1", status: "Available" },
    { id: 2, slotNumber: "A2", status: "Occupied" },
    { id: 3, slotNumber: "A3", status: "Available" },
    { id: 4, slotNumber: "B1", status: "Occupied" },
    { id: 5, slotNumber: "B2", status: "Available" },
    { id: 6, slotNumber: "B3", status: "Available" },
  ];

  const [slots, setSlots] = useState(initialSlots);

  // Simulate real-time update every 5 seconds (for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      setSlots((prev) =>
        prev.map((slot) => ({
          ...slot,
          // randomly change status
          status: Math.random() > 0.5 ? "Available" : "Occupied",
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarLayout>
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Real-Time Parking Availability</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`p-6 rounded-lg shadow text-center font-bold ${
                slot.status === "Available"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <p className="text-xl">{slot.slotNumber}</p>
              <p>{slot.status}</p>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
