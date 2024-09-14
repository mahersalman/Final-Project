import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DepartmentDropdown from '../DepartmentDropdown';
import StationSelector from '../StationSelector';
import StatusDropdown from './StatusDropdown';

const EditEmployeeForm = ({ employee, onClose, onUpdateEmployee }) => {
  const [department, setDepartment] = useState(employee.department);
  const [status, setStatus] = useState(employee.status || 'פעיל'); // Default to 'פעיל' if status is not set
  const [stations, setStations] = useState([]);
  const [stationAverages, setStationAverages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5001/api/qualifications/${employee.person_id}`);
        const qualifications = response.data;
        setStations(qualifications.map(q => q.station_name));
        const averages = {};
        qualifications.forEach(q => {
          averages[q.station_name] = q.avg;
        });
        setStationAverages(averages);
      } catch (err) {
        console.error('Error fetching qualifications:', err);
        setError('Failed to fetch employee qualifications');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQualifications();
  }, [employee.person_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await axios.put(`http://localhost:5001/api/employees/${employee.person_id}`, {
        department,
        status // Include status in the update
      });

      const qualificationPromises = Object.entries(stationAverages).map(([station, avg]) => 
        axios.put('http://localhost:5001/api/qualifications', {
          person_id: employee.person_id,
          station_name: station,
          avg: parseFloat(avg)
        })
      );
      await Promise.all(qualificationPromises);

      setSuccessMessage('Employee data updated successfully');
      onUpdateEmployee({ ...employee, department, stations, status }); // Include status in the updated employee object
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error updating employee:', error);
      setError(`Error updating employee data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !successMessage) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <p className="text-xl">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        <h2 className="text-xl sm:text-2xl font-bold p-4 sm:p-6 pb-0">עריכת פרטי עובד</h2>
        <div className="overflow-y-auto flex-grow p-4 sm:p-6 pt-4">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              initialAverages={stationAverages}
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
              disabled={isLoading}
            >
              {isLoading ? 'מעדכן...' : 'עדכן פרטים'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeForm;