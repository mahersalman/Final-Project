import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReportDisplay from "./ReportDisplay";
import serverUrl from "@config/api";

const ALL_STATIONS_OPTION = {
  _id: "ALL",
  station_id: "ALL",
  station_name: "כל התחנות",
};
const ALL_EMPLOYEES_OPTION = {
  _id: "ALL",
  person_id: "ALL",
  first_name: "כל",
  last_name: "העובדים",
};

const ReportGenerator = () => {
  const [employees, setEmployees] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedEmployee, setSelectedEmployee] =
    useState(ALL_EMPLOYEES_OPTION);
  const [selectedStation, setSelectedStation] = useState(ALL_STATIONS_OPTION);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/employees`);
        setEmployees(data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("נכשל באחזור עובדים");
      }
    };

    const fetchStations = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/stations`);
        setStations(data || []);
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError("נכשל באחזור תחנות");
      }
    };

    fetchEmployees();
    fetchStations();
  }, []);

  const stationsWithAll = useMemo(
    () => [ALL_STATIONS_OPTION, ...(stations || [])],
    [stations]
  );
  const employeesWithAll = useMemo(
    () => [ALL_EMPLOYEES_OPTION, ...(employees || [])],
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return employeesWithAll;
    return employeesWithAll.filter(
      (emp) =>
        `${emp.first_name ?? ""}`.toLowerCase().includes(q) ||
        `${emp.last_name ?? ""}`.toLowerCase().includes(q)
    );
  }, [employeesWithAll, searchQuery]);

  const handleStationChange = (stationId) => {
    const station =
      stationsWithAll.find((s) => s._id === stationId) || ALL_STATIONS_OPTION;
    setSelectedStation(station);
    setReportData(null);
    setReportType(null);
  };

  const handleEmployeeSelect = (emp) => {
    setSelectedEmployee(emp || ALL_EMPLOYEES_OPTION);
    setReportData(null);
    setReportType(null);
  };

  const handleClearEmployee = () => {
    setSelectedEmployee(ALL_EMPLOYEES_OPTION);
    setReportData(null);
    setReportType(null);
  };

  const datesValid =
    startDate &&
    endDate &&
    new Date(endDate.setHours(0, 0, 0, 0)).getTime() >=
      new Date(startDate.setHours(0, 0, 0, 0)).getTime();

  const handleGenerateReport = async () => {
    setError(null);

    if (!startDate || !endDate) {
      setError("אנא בחר תאריך התחלה ותאריך סיום.");
      return;
    }
    if (!datesValid) {
      setError("תאריך סיום לא יכול להיות קטן מתאריך ההתחלה.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("startDate", startDate.toISOString());
      params.append("endDate", endDate.toISOString());

      // Only include filters if a specific station/employee was selected
      if (selectedStation && selectedStation._id !== "ALL") {
        params.append(
          "stationId",
          selectedStation.station_id || selectedStation._id
        );
      }
      if (selectedEmployee && selectedEmployee._id !== "ALL") {
        params.append(
          "employee",
          selectedEmployee.person_id || selectedEmployee._id
        );
      }

      const { data } = await axios.get(
        `${serverUrl}/api/report?${params.toString()}`
      );
      setReportData(data);

      const isSameDay = startDate.toDateString() === endDate.toDateString();
      const hasSpecificEmployee =
        selectedEmployee && selectedEmployee._id !== "ALL";
      // reportType is mainly for UI; CSV logic detects array vs object anyway.
      if (isSameDay) {
        setReportType(hasSpecificEmployee ? "dailyEmployee" : "daily");
      } else {
        setReportType(hasSpecificEmployee ? "rangeEmployee" : "range");
      }
      setShowReportModal(true);
    } catch (err) {
      console.error("Error generating report:", err);
      setError("נכשל ביצירת הדוח. נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Excel/CSV (with metadata columns) ----
  const handleDownloadReport = () => {
    if (!reportData || !startDate || !endDate) return;

    // Hebrew-friendly BOM so Excel shows RTL text correctly
    let csvContent = "\uFEFF"; // BOM
    const stationName =
      selectedStation && selectedStation._id !== "ALL"
        ? selectedStation.station_name
        : "כל התחנות";
    const employeeName =
      selectedEmployee && selectedEmployee._id !== "ALL"
        ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
        : "כל העובדים";
    const startStr = startDate.toLocaleDateString("he-IL");
    const endStr = endDate.toLocaleDateString("he-IL");

    // If backend returned an array => per-day rows
    if (Array.isArray(reportData)) {
      // Headers
      csvContent +=
        [
          "תחנה",
          "עובד",
          "תאריך התחלה",
          "תאריך סיום",
          "תאריך",
          "שסתומים תקינים",
          "שסתומים פגומים",
        ].join(",") + "\n";

      reportData.forEach((row) => {
        const d = row._id ?? "";
        const good = row.goodValves ?? 0;
        const invalid = row.invalidValves ?? 0;
        csvContent +=
          [stationName, employeeName, startStr, endStr, d, good, invalid]
            .map(safe)
            .join(",") + "\n";
      });
    } else {
      // Single totals object for the entire range
      const good = reportData.goodValves ?? 0;
      const invalid = reportData.invalidValves ?? 0;

      // Headers
      csvContent +=
        [
          "תחנה",
          "עובד",
          "תאריך התחלה",
          "תאריך סיום",
          "שסתומים תקינים (סה״כ)",
          "שסתומים פגומים (סה״כ)",
        ].join(",") + "\n";

      csvContent +=
        [stationName, employeeName, startStr, endStr, good, invalid]
          .map(safe)
          .join(",") + "\n";
    }

    const encodedUri =
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `report_${reportType ?? "range"}_${new Date().toISOString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function safe(v) {
    // escape CSV fields that may contain commas/quotes/newlines
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  const selectedStationName =
    selectedStation && selectedStation._id !== "ALL"
      ? selectedStation.station_name
      : "כל התחנות";

  const selectedEmployeeName =
    selectedEmployee && selectedEmployee._id !== "ALL"
      ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
      : "כל העובדים";

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md max-w-3xl mx-auto h-full md:h-auto overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
        יצירת דוח
      </h2>

      {/* Station */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">בחר תחנה</label>
        <select
          value={selectedStation?._id || "ALL"}
          onChange={(e) => handleStationChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {stationsWithAll.map((station) => (
            <option key={station._id} value={station._id}>
              {station.station_name}
            </option>
          ))}
        </select>
      </div>

      {/* Employee + search */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">בחר עובד</label>
        <div className="flex items-center mb-2">
          <input
            type="text"
            placeholder="חיפוש עובד..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow p-2 border rounded"
          />
          {selectedEmployee && selectedEmployee._id !== "ALL" && (
            <button
              onClick={handleClearEmployee}
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              נקה
            </button>
          )}
        </div>
        <div className="max-h-32 md:max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
          {filteredEmployees.length === 0 ? (
            <p className="p-4 text-center text-gray-500">לא נמצאו עובדים</p>
          ) : (
            <ul className="space-y-1 md:space-y-2 p-2">
              {filteredEmployees.map((emp) => (
                <li
                  key={emp._id}
                  onClick={() => handleEmployeeSelect(emp)}
                  className={`cursor-pointer p-2 md:p-3 rounded transition duration-150 ease-in-out ${
                    selectedEmployee && selectedEmployee._id === emp._id
                      ? "bg-[#246B35] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {emp.first_name} {emp.last_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Date range */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold">תאריך התחלה</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              if (date && endDate && endDate < date) setEndDate(date);
              setReportData(null);
              setReportType(null);
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="w-full p-2 border rounded"
            dateFormat="dd/MM/yyyy"
            placeholderText="בחר תאריך התחלה"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">תאריך סיום</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
              setReportData(null);
              setReportType(null);
            }}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || undefined}
            className="w-full p-2 border rounded"
            dateFormat="dd/MM/yyyy"
            placeholderText="בחר תאריך סיום"
          />
        </div>
      </div>

      {/* Current filters summary */}
      <div className="mt-4 p-3 md:p-4 bg-gray-100 rounded-lg text-sm md:text-base">
        <h3 className="font-semibold mb-2">תנאי הדוח הנוכחי:</h3>
        <ul className="list-disc list-inside">
          <li>תחנה: {selectedStationName}</li>
          <li>עובד: {selectedEmployeeName}</li>
          <li>
            טווח תאריכים:{" "}
            {startDate ? startDate.toLocaleDateString("he-IL") : "—"} עד{" "}
            {endDate ? endDate.toLocaleDateString("he-IL") : "—"}
          </li>
        </ul>
        {!datesValid && (startDate || endDate) && (
          <p className="text-red-600 mt-2">
            ודא שתאריך הסיום אינו קטן מתאריך ההתחלה.
          </p>
        )}
      </div>

      {/* Generate */}
      <button
        onClick={handleGenerateReport}
        className={`mt-4 w-full font-bold py-2 px-4 rounded transition duration-150 ease-in-out text-sm md:text-base ${
          datesValid
            ? "bg-[#1F6231] hover:bg-[#309d49] text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!datesValid || loading}
      >
        {loading ? "מייצר דוח..." : "יצירת דוח"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Modal */}
      {showReportModal && reportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <ReportDisplay
              reportData={reportData}
              reportType={reportType}
              station={selectedStationName}
              // For single-day compatibility:
              date={
                startDate &&
                endDate &&
                startDate.toDateString() === endDate.toDateString()
                  ? startDate
                  : null
              }
              startDate={startDate}
              endDate={endDate}
              employee={
                selectedEmployee && selectedEmployee._id !== "ALL"
                  ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
                  : null
              }
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleDownloadReport}
                className="bg-[#1F6231] hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded"
              >
                הורד דוח (Excel)
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
