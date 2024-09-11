import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReportGenerator = () => {
  const [employees, setEmployees] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStations, setSelectedStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchStations = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/stations');
        setStations(response.data.map(station => station.station_name));
      } catch (error) {
        console.error('Error fetching stations:', error);
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
    setSelectedStations(prevStations =>
      prevStations.includes(station)
        ? prevStations.filter(s => s !== station)
        : [...prevStations, station]
    );
  };

  const handleGenerateReport = () => {
    const reportData = {
      employee: selectedEmployee,
      date: selectedDate,
      stations: selectedStations,
    };
    console.log('Generating report with:', reportData);
    // Here you would typically make an API call to generate the report
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md max-w-3xl mx-auto h-full md:h-auto overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">יצירת דוח</h2>
      
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
                  onClick={() => setSelectedEmployee(emp)}
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
          onChange={(date) => setSelectedDate(date)}
          className="w-full p-2 border rounded"
          dateFormat="dd/MM/yyyy"
          placeholderText="בחר תאריך"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">בחר תחנות (אופציונלי)</label>
        <div className="max-h-32 md:max-h-48 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-white">
          {stations.length > 0 ? (
            stations.map((station, index) => (
              <div key={index} className="flex items-center p-2 md:p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                <input
                  type="checkbox"
                  id={`station-${index}`}
                  value={station}
                  checked={selectedStations.includes(station)}
                  onChange={() => handleStationChange(station)}
                  className="form-checkbox h-4 w-4 md:h-5 md:w-5 text-[#1F6231] rounded border-gray-300 focus:ring-[#1F6231] transition duration-150 ease-in-out"
                />
                <label htmlFor={`station-${index}`} className="ml-2 md:ml-3 text-sm md:text-base font-medium text-gray-700">{station}</label>
              </div>
            ))
          ) : (
            <p className="p-3 text-gray-500 text-sm md:text-base">לא נמצאו תחנות.</p>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 md:p-4 bg-gray-100 rounded-lg text-sm md:text-base">
        <h3 className="font-semibold mb-2">תנאי הדוח הנוכחי:</h3>
        <ul className="list-disc list-inside">
          <li>עובד: {selectedEmployee ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}` : 'לא נבחר'}</li>
          <li>תאריך: {selectedDate ? selectedDate.toLocaleDateString('he-IL') : 'לא נבחר'}</li>
          <li>תחנות: {selectedStations.length > 0 ? selectedStations.join(', ') : 'לא נבחרו'}</li>
        </ul>
      </div>

      <button
        onClick={handleGenerateReport}
        className="mt-4 w-full bg-[#1F6231] hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out text-sm md:text-base"
      >
        יצירת דוח
      </button>
    </div>
  );
};

export default ReportGenerator;