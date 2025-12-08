import React from "react";

function SlotCard({ id, status }) {
  const isFree = status === "Available";

  return (
    <div
      className={`p-4 rounded-lg shadow text-center border 
      ${isFree ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400"}
      `}
    >
      <h3 className="text-xl font-bold">{id}</h3>
      <p className="mt-2 font-semibold">{status}</p>
    </div>
  );
}

export default SlotCard;
