import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/parking/Dashboard";
import SlotAllocation from "./pages/parking/SlotAllocation";
import GuestVehicleRegistration from "./pages/parking/GuestVehicleRegistration";
        import RealTimeAvailability from "./pages/parking/RealTimeAvailability";
         import EntryExitLog from "./pages/parking/EntryExitLogs";
           import ParkingHistory from "./pages/parking/ParkingHistory";
           import DriverManagement from "./pages/taxi-booking/DriverManagement";
             import TaxiManagement from "./pages/taxi-booking/TaxiManagement";
             import TaxiRequest from "./pages/taxi-booking/TaxiRequest";
              import TaxiBooking from "./pages/taxi-booking/TaxiBooking";
             



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root "/" to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/slot-allocation" element={<SlotAllocation />} />
        <Route path="/guest-vehicle-registration" element={<GuestVehicleRegistration />} />
      

<Route path="/parking-history" element={<ParkingHistory />} />

       <Route path="/taxi-request" element={<TaxiRequest />} />


<Route path="/entry-exit-logs" element={<EntryExitLog />} />

<Route path="/taxi/drivers" element={<DriverManagement />} />
<Route path="/taxi/management" element={<TaxiManagement />} />

<Route path="/taxi-booking" element={<TaxiBooking />} />





<Route path="/parking-availability" element={<RealTimeAvailability />} />

      </Routes>
    </BrowserRouter>
  );
}
