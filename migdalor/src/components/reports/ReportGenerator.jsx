import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReportDisplay from './ReportDisplay';

const ReportGenerator = () => {
  const [employees, setEmployees] = useState([]);
  const [stations, setStations] = useState([]);
  const [workstations, setWorkstations] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedWorkstations, setSelectedWorkstations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchWorkstations = async () => {
      if (selectedStation) {
        try {
          const response = await axios.get(`http://localhost:5001/api/workstations/${encodeURIComponent(selectedStation.station_name)}`);
          setWorkstations(prevWorkstations => ({
            ...prevWorkstations,
            [selectedStation.station_name]: response.data
          }));
        } catch (error) {
          console.error('Error fetching workstations:', error);
          setError('Failed to fetch workstations');
        }
      }
    };

    fetchWorkstations();
  }, [selectedStation]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp =>
      emp.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  const handleStationChange = (station) => {
    setSelectedStation(station);
    setSelectedWorkstations([]);
    setReportData(null);
    setReportType(null);
  };

  const handleWorkstationChange = (workstation) => {
    setSelectedWorkstations(prevWorkstations =>
      prevWorkstations.includes(workstation)
        ? prevWorkstations.filter(w => w !== workstation)
        : [...prevWorkstations, workstation]
    );
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
      if (selectedWorkstations.length > 0) params.append('workstations', selectedWorkstations.join(','));
      if (selectedDate) params.append('date', selectedDate.toISOString());
      if (selectedEmployee) params.append('employee', selectedEmployee.person_id);

      const response = await axios.get(`http://localhost:5001/api/report?${params}`);
      setReportData(response.data);

      if (selectedDate) {
        setReportType('daily');
      } else if (selectedWorkstations.length > 0) {
        setReportType('workstation');
      } else {
        setReportType('monthly');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
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

      {selectedStation && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold">בחר עמדות עבודה</label>
          <div className="max-h-32 md:max-h-48 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-white">
            {workstations[selectedStation.station_name] && workstations[selectedStation.station_name].length > 0 ? (
              workstations[selectedStation.station_name].map((workstation, index) => (
                <div key={index} className="flex items-center p-2 md:p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                  <input
                    type="checkbox"
                    id={`workstation-${index}`}
                    value={workstation.workingStation_name}
                    checked={selectedWorkstations.includes(workstation.workingStation_name)}
                    onChange={() => handleWorkstationChange(workstation.workingStation_name)}
                    className="form-checkbox h-4 w-4 md:h-5 md:w-5 text-[#1F6231] rounded border-gray-300 focus:ring-[#1F6231] transition duration-150 ease-in-out"
                  />
                  <label htmlFor={`workstation-${index}`} className="ml-2 md:ml-3 text-sm md:text-base font-medium text-gray-700">{workstation.workingStation_name}</label>
                </div>
              ))
            ) : (
              <p className="p-3 text-gray-500 text-sm md:text-base">לא נמצאו עמדות עבודה.</p>
            )}
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 font-semibold">בחר עובד (אופציונלי)</label>
        <input
          type="text"
          placeholder="חיפוש עובד..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <div className="max-h-32 md:max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
          {filteredEmployees.length === 0 ? (
            <p className="p-4 text-center text-gray-500">לא נמצאו עובדים</p>
          ) : (
            <ul className="space-y-1 md:space-y-2 p-2">
              {filteredEmployees.map((emp) => (
                <li
                  key={emp._id}
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setReportData(null);
                    setReportType(null);
                  }}
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
          <li>עמדות עבודה: {selectedWorkstations.length > 0 ? selectedWorkstations.join(', ') : 'לא נבחרו'}</li>
          <li>עובד: {selectedEmployee ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}` : 'לא נבחר'}</li>
          <li>תאריך: {selectedDate ? selectedDate.toLocaleDateString('he-IL') : 'לא נבחר'}</li>
        </ul>
      </div>

      <button
        onClick={handleGenerateReport}
        className="mt-4 w-full bg-[#1F6231] hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out text-sm md:text-base"
        disabled={!selectedStation || loading}
      >
        {loading ? 'מייצר דוח...' : 'יצירת דוח'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {reportData && (
        <ReportDisplay
          reportData={reportData}
          reportType={reportType}
          station={selectedStation.station_name}
          workstations={selectedWorkstations}
          date={selectedDate}
          employee={selectedEmployee ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}` : null}
        />
      )}
    </div>
  );
};

export default ReportGenerator;