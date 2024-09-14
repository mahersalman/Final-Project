import React, { useState } from 'react';
import axios from 'axios';
import DepartmentDropdown from '../DepartmentDropdown'
import StationSelector from '../StationSelector';
import StatusDropdown from './StatusDropdown';

const AddEmployeeForm = ({ onClose, onAddEmployee }) => {
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [id, setId] = useState('');
  const [stations, setStations] = useState([]);
  const [stationAverages, setStationAverages] = useState({});

  const handleSubmit = async (e) => {
    console.log('Submit button clicked');
    e.preventDefault();
    try {
      const employeeResponse = await axios.post('http://localhost:5001/api/employees', {
        person_id: id,
        first_name: fname,
        last_name: lname,
        department,
        status,
        role: 'Employee',
      });
      const qualificationPromises = Object.entries(stationAverages).map(([station, avg]) =>
        axios.post('http://localhost:5001/api/qualifications', {
          person_id: id,
          station_name: station,
          avg: parseFloat(avg)
        })
      );
      await Promise.all(qualificationPromises);
      onAddEmployee(employeeResponse.data);
      onClose();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        <h2 className="text-xl sm:text-2xl font-bold p-4 sm:p-6 pb-0">הוספת עובד חדש</h2>
        <div className="overflow-y-auto flex-grow p-4 sm:p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">שם פרטי:</label>
              <input
                type="text"
                placeholder='ישראל'
                value={fname}
                onChange={(e) => setFName(e.target.value)}
                className="w-full border p-2 rounded text-sm"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">שם משפחה:</label>
              <input
                type="text"
                placeholder='ישראלי'
                value={lname}
                onChange={(e) => setLName(e.target.value)}
                className="w-full border p-2 rounded text-sm"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">תעודת זהות:</label>
              <input
                type="number"
                placeholder='111111111'
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full border p-2 rounded text-sm"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">בחירת מחלקה:</label>
              <DepartmentDropdown
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">סטטוס עובד:</label>
              <StatusDropdown
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 text-sm"
              />
            </div>
            <StationSelector
              selectedStations={stations}
              onChange={setStations}
              onAverageChange={setStationAverages}
            />
          </form>
        </div>
        <div className="p-4 sm:p-6 pt-0 border-t">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded text-sm font-medium hover:bg-gray-400 transition-colors"
            >
              ביטול
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-[#1F6231] text-white text-sm font-medium hover:bg-[#309d49] transition-colors"
            >
              הוסף עובד
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeForm;