import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DepartmentDropdown from '../DepartmentDropdown';
import StationSelector from '../StationSelector';

const EditEmployeeForm = ({ employee, onClose, onUpdateEmployee }) => {
  const [department, setDepartment] = useState(employee.department);
  const [stations, setStations] = useState([]);
  const [stationAverages, setStationAverages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/qualifications/${employee.person_id}`);
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
      // Update employee's department
      await axios.put(`http://localhost:5000/api/employees/${employee.person_id}`, {
        department
      });

      // Update qualifications
      const qualificationPromises = Object.entries(stationAverages).map(([station, avg]) => 
        axios.post('http://localhost:5000/api/qualifications', {
          person_id: employee.person_id,
          station_name: station,
          avg: parseFloat(avg)
        })
      );
      const qualificationResults = await Promise.all(qualificationPromises);

      // Check if any qualification updates failed
      const failedUpdates = qualificationResults.filter(result => result.status !== 200);
      if (failedUpdates.length > 0) {
        throw new Error(`Failed to update ${failedUpdates.length} qualifications`);
      }

      setSuccessMessage('Employee data updated successfully');
      onUpdateEmployee({ ...employee, department, stations });
      
      // Delay closing the form to show the success message
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

  if (isLoading && !successMessage) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-2/5 p-6 rounded-lg relative">
        <h2 className="text-2xl font-bold mb-4">עריכת פרטי עובד</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>בחירת מחלקה: </label>
            <DepartmentDropdown
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2"
            />
          </div>
          <StationSelector
            selectedStations={stations}
            onChange={setStations}
            onAverageChange={setStationAverages}
            initialAverages={stationAverages}
          />
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 rounded"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#1F6231] border-none relative pointer hover:bg-[#309d49] text-white"
              disabled={isLoading}
            >
              {isLoading ? 'מעדכן...' : 'עדכן פרטים'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeForm;