import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReportDisplay from './ReportDisplay';

const ReportGenerator = () => {
  const [employees, setEmployees] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError('Failed to fetch employees');
      }
    };

    const fetchStations = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/stations');
        setStations(response.data);
      } catch (error) {
        console.error('Error fetching stations:', error);
        setError('Failed to fetch stations');
      }
    };

    fetchEmployees();
    fetchStations();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp =>
      emp.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  const handleStationChange = (station) => {
    setSelectedStation(station);
    setReportData(null);
    setReportType(null);
  };

  const handleEmployeeSelect = (emp) => {
    setSelectedEmployee(emp);
    setReportData(null);
    setReportType(null);
  };

  const handleClearEmployee = () => {
    setSelectedEmployee(null);
    setReportData(null);
    setReportType(null);
  };

  const handleGenerateReport = async () => {
    if (!selectedStation) {
      alert('Please select a station before generating the report.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ station: selectedStation.station_name });
      if (selectedDate) params.append('date', selectedDate.toISOString());
      if (selectedEmployee) params.append('employee', selectedEmployee.person_id);

      const response = await axios.get(`http://localhost:5001/api/report?${params}`);
      setReportData(response.data);

      if (selectedDate) {
        setReportType('daily');
      } else if (selectedEmployee) {
        setReportType('monthlyEmployee');
      } else {
        setReportType('monthly');
      }
      setShowReportModal(true);
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!reportData) return;

    let csvContent = "data:text/csv;charset=utf-8,";

    // Add headers
    if (reportType === 'daily') {
      csvContent += "Category,Count\n";
      csvContent += `Good Valves,${reportData.goodValves}\n`;
      csvContent += `Invalid Valves,${reportData.invalidValves}\n`;
    } else {
      csvContent += "Date,Good Valves,Invalid Valves\n";
      reportData.forEach(item => {
        csvContent += `${item._id},${item.goodValves},${item.invalidValves}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${reportType}_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md max-w-3xl mx-auto h-full md:h-auto overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">יצירת דוח</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">בחר תחנה (חובה)</label>
        <select
          value={selectedStation ? selectedStation._id : ''}
          onChange={(e) => handleStationChange(stations.find(s => s._id === e.target.value))}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">בחר תחנה</option>
          {stations.map((station) => (
            <option key={station._id} value={station._id}>{station.station_name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">בחר עובד (אופציונלי)</label>
        <div className="flex items-center mb-2">
          <input
            type="text"
            placeholder="חיפוש עובד..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow p-2 border rounded"
          />
          {selectedEmployee && (
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
                      ? 'bg-[#246B35] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {emp.first_name} {emp.last_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">בחר תאריך (אופציונלי)</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setReportData(null);
            setReportType(null);
          }}
          className="w-full p-2 border rounded"
          dateFormat="dd/MM/yyyy"
          placeholderText="בחר תאריך"
        />
      </div>

      <div className="mt-4 p-3 md:p-4 bg-gray-100 rounded-lg text-sm md:text-base">
        <h3 className="font-semibold mb-2">תנאי הדוח הנוכחי:</h3>
        <ul className="list-disc list-inside">
          <li>תחנה: {selectedStation ? selectedStation.station_name : 'לא נבחרה'}</li>
          <li>עובד: {selectedEmployee ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}` : 'לא נבחר'}</li>
          <li>תאריך: {selectedDate ? selectedDate.toLocaleDateString('he-IL') : 'לא נבחר'}</li>
        </ul>
      </div>

      <button
        onClick={handleGenerateReport}
        className={`mt-4 w-full font-bold py-2 px-4 rounded transition duration-150 ease-in-out text-sm md:text-base ${
          selectedStation
            ? 'bg-[#1F6231] hover:bg-[#309d49] text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={!selectedStation || loading}
      >
        {loading ? 'מייצר דוח...' : 'יצירת דוח'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {showReportModal && reportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <ReportDisplay
              reportData={reportData}
              reportType={reportType}
              station={selectedStation.station_name}
              date={selectedDate}
              employee={selectedEmployee ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}` : null}
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleDownloadReport}
                className="bg-[#1F6231] hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded"
              >
                הורד דוח
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