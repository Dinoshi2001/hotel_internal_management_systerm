import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SidebarLayout from "../../layout/SidebarLayout";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function EntryExitLogs() {
  const [rawLogs, setRawLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Column filters
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [guestFilter, setGuestFilter] = useState("");
  const [slotFilter, setSlotFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [entryDateFilter, setEntryDateFilter] = useState("");
  const [entryTimeFilter, setEntryTimeFilter] = useState("");
  const [exitDateFilter, setExitDateFilter] = useState("");
  const [exitTimeFilter, setExitTimeFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      let res = await axios.get("http://localhost:5000/api/parking/logs").catch(() => null);
      if (!res || !res.data) {
        res = await axios.get("http://localhost:5000/api/slots");
      }
      const data = res.data;
      let items = [];
      if (data && data.logs && Array.isArray(data.logs)) {
        items = data.logs;
      } else if (Array.isArray(data)) {
        items = data;
      } else if (data && data.slots && Array.isArray(data.slots)) {
        items = data.slots;
      } else {
        items = [];
      }
      setRawLogs(items);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch logs");
    } finally {
      setLoading(false);
      setCurrentPage(1);
    }
  };

  const normalizeLog = (item) => {
    const vehicleObj = item.vehicle && typeof item.vehicle === "object" ? item.vehicle : null;
    return {
      id: item._id || item.id || Math.random().toString(36).slice(2),
      vehicleNumber: vehicleObj?.vehicleNumber || item.vehicleNumber || "",
      guestName: vehicleObj?.guestName || item.guestName || "",
      slotNumber: item.slotNumber ?? item.slot ?? null,
      entryTime: item.entryTime ? new Date(item.entryTime) : (item.allocationTime ? new Date(item.allocationTime) : null),
      exitTime: item.exitTime ? new Date(item.exitTime) : null,
      status: item.status || (item.exitTime ? "exited" : "entered"),
    };
  };

  const logs = useMemo(() => rawLogs.map(normalizeLog), [rawLogs]);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (vehicleFilter && !log.vehicleNumber.toLowerCase().includes(vehicleFilter.toLowerCase())) return false;
      if (guestFilter && !log.guestName.toLowerCase().includes(guestFilter.toLowerCase())) return false;
      if (slotFilter && String(log.slotNumber).toLowerCase().indexOf(slotFilter.toLowerCase()) === -1) return false;
      if (statusFilter && !log.status.toLowerCase().includes(statusFilter.toLowerCase())) return false;
      if (entryDateFilter && format(log.entryTime || new Date(0), "yyyy-MM-dd").indexOf(entryDateFilter) === -1) return false;
      if (entryTimeFilter && format(log.entryTime || new Date(0), "HH:mm:ss").indexOf(entryTimeFilter) === -1) return false;
      if (exitDateFilter && format(log.exitTime || new Date(0), "yyyy-MM-dd").indexOf(exitDateFilter) === -1) return false;
      if (exitTimeFilter && format(log.exitTime || new Date(0), "HH:mm:ss").indexOf(exitTimeFilter) === -1) return false;

      return true;
    });
  }, [
    logs,
    vehicleFilter,
    guestFilter,
    slotFilter,
    statusFilter,
    entryDateFilter,
    entryTimeFilter,
    exitDateFilter,
    exitTimeFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const formatDate = (d) => d ? format(d, "yyyy-MM-dd") : "-";
  const formatTime = (d) => d ? format(d, "HH:mm:ss") : "-";

  const resetFilters = () => {
    setVehicleFilter(""); setGuestFilter(""); setSlotFilter(""); setStatusFilter("");
    setEntryDateFilter(""); setEntryTimeFilter(""); setExitDateFilter(""); setExitTimeFilter("");
    setCurrentPage(1);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Entry / Exit Logs", 14, 15);
    const tableColumn = ["Entry Date", "Entry Time", "Exit Date", "Exit Time", "Vehicle No.", "Guest Name", "Slot", "Status"];
    const tableRows = filtered.map(log => [
      formatDate(log.entryTime),
      formatTime(log.entryTime),
      formatDate(log.exitTime),
      formatTime(log.exitTime),
      log.vehicleNumber,
      log.guestName,
      log.slotNumber,
      log.status
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20, styles: { fontSize: 8 }, headStyles: { fillColor: [52, 58, 64] } });
    doc.save("entry_exit_logs.pdf");
  };

  return (
    <SidebarLayout>
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Entry / Exit Logs</h1>

        <div className="mb-4 flex gap-2">
          <button onClick={fetchLogs} className="px-3 py-2 bg-blue-600 text-white rounded">Refresh</button>
          <button onClick={resetFilters} className="px-3 py-2 border rounded">Reset Filters</button>
          <button onClick={downloadPDF} className="px-3 py-2 bg-green-600 text-white rounded">Download PDF</button>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 text-left">#</th>
                <th className="px-2 py-2 text-left">Entry Date<br/><input type="date" value={entryDateFilter} onChange={e => setEntryDateFilter(e.target.value)} className="w-full border rounded px-1 py-0.5"/></th>
                <th className="px-2 py-2 text-left">Entry Time<br/><input type="time" value={entryTimeFilter} onChange={e => setEntryTimeFilter(e.target.value)} className="w-full border rounded px-1 py-0.5"/></th>
                <th className="px-2 py-2 text-left">Exit Date<br/><input type="date" value={exitDateFilter} onChange={e => setExitDateFilter(e.target.value)} className="w-full border rounded px-1 py-0.5"/></th>
                <th className="px-2 py-2 text-left">Exit Time<br/><input type="time" value={exitTimeFilter} onChange={e => setExitTimeFilter(e.target.value)} className="w-full border rounded px-1 py-0.5"/></th>
                <th className="px-2 py-2 text-left">Vehicle No.<br/><input type="text" placeholder="Filter" value={vehicleFilter} onChange={e => setVehicleFilter(e.target.value)} className="w-full border rounded px-1 py-0.5"/></th>
                <th className="px-2 py-2 text-left">Guest Name<br/><input type="text" placeholder="Filter" value={guestFilter} onChange={e => setGuestFilter(e.target.value)} className="w-full border rounded px-1 py-0.5"/></th>
                <th className="px-2 py-2 text-left">Slot<br/><input type="text" placeholder="Filter" value={slotFilter} onChange={e => setSlotFilter(e.target.value)} className="w-full border rounded px-1 py-0.5"/></th>
                <th className="px-2 py-2 text-left">Status<br/><input type="text" placeholder="Filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full border rounded px-1 py-0.5"/></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="p-4 text-center">Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan="9" className="p-4 text-center">No logs found</td></tr>
              ) : paginated.map((log, idx) => (
                <tr key={log.id}>
                  <td className="px-2 py-2">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                  <td className="px-2 py-2">{format(log.entryTime, "yyyy-MM-dd")}</td>
                  <td className="px-2 py-2">{format(log.entryTime, "HH:mm:ss")}</td>
                  <td className="px-2 py-2">{format(log.exitTime, "yyyy-MM-dd")}</td>
                  <td className="px-2 py-2">{format(log.exitTime, "HH:mm:ss")}</td>
                  <td className="px-2 py-2">{log.vehicleNumber || "-"}</td>
                  <td className="px-2 py-2">{log.guestName || "-"}</td>
                  <td className="px-2 py-2">{log.slotNumber ?? "-"}</td>
                  <td className="px-2 py-2">{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between p-3 border-t">
            <div>
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="px-3 py-1 border rounded mr-2" disabled={currentPage === 1}>Prev</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} className="px-3 py-1 border rounded" disabled={currentPage === totalPages}>Next</button>
            </div>
            <div className="text-sm text-gray-600">Page {currentPage} / {totalPages}</div>
          </div>
        </div>

        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>
    </SidebarLayout>
  );
}
