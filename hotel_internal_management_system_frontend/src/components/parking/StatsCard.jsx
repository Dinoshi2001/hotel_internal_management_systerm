import React from "react";

function StatsCard({ title, value }) {
  return (
    <div className="p-5 bg-white shadow rounded-lg text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default StatsCard;
