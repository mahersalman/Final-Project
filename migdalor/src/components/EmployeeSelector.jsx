import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeSelector = ({ selectedEmployees, onChange, maxSelections, selectedStations }) => {
  // State declarations
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [qualifications, setQualifications] = useState({});
  const [assignedEmployees, setAssignedEmployees] = useState({});

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/employees');
        console.log('Fetched employees:', response.data);
        setEmployeeOptions(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch qualifications
  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/qualifications');
        console.log('Fetched qualifications:', response.data);
        const qualificationsData = response.data.reduce((acc, qual) => {
          if (!acc[qual.person_id]) {
            acc[qual.person_id] = [];
          }
          acc[qual.person_id].push(qual);
          return acc;
        }, {});
        console.log('Processed qualifications:', qualificationsData);
        setQualifications(qualificationsData);
      } catch (error) {
        console.error('Error fetching qualifications:', error);
      }
    };
    fetchQualifications();
  }, []);

  // Assign employees (genetic algorithm)
  useEffect(() => {
    const assignEmployees = async () => {
      if (selectedEmployees.length > 0 && selectedStations.length > 0) {
        try {
          const response = await axios.post('http://localhost:5001/api/assign-employees', {
            selectedStations,
            selectedEmployees
          });
          setAssignedEmployees(response.data);
        } catch (error) {
          console.error('Error assigning employees:', error);
        }
      }
    };
    assignEmployees();
  }, [selectedEmployees, selectedStations]);

  // Handle checkbox changes
  const handleCheckboxChange = (employeeId) => {
    const updatedEmployees = selectedEmployees.includes(employeeId)
      ? selectedEmployees.filter(id => id !== employeeId)
      : [...selectedEmployees, employeeId];
    
    if (updatedEmployees.length <= maxSelections) {
      onChange(updatedEmployees);
    }
  };

  // Helper functions
  const getEmployeeQualificationsCount = (employeeId) => {
    return qualifications[employeeId]?.length || 0;
  };

  const getEmployeeAverageQualification = (employeeId) => {
    const employeeQuals = qualifications[employeeId] || [];
    if (employeeQuals.length === 0) return 0;
    const sum = employeeQuals.reduce((acc, qual) => acc + qual.avg, 0);
    return (sum / employeeQuals.length).toFixed(2);
  };

  // Render component
  return (
    <div className="mb-6">
      <label className="block text-lg font-semibold mb-3">עובדים ({selectedEmployees.length}/{maxSelections}):</label>
      <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-white">
        {employeeOptions.length > 0 ? (
          employeeOptions.map((employee) => (
            <div key={employee._id} className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`employee-${employee._id}`}
                  value={employee._id}
                  checked={selectedEmployees.includes(employee._id)}
                  onChange={() => handleCheckboxChange(employee._id)}
                  disabled={!selectedEmployees.includes(employee._id) && selectedEmployees.length >= maxSelections}
                  className="form-checkbox h-5 w-5 text-[#1F6231] rounded border-gray-300 focus:ring-[#1F6231] transition duration-150 ease-in-out"
                />
                <label htmlFor={`employee-${employee._id}`} className="mr-3 text-sm font-medium text-gray-700">
                  {`${employee.first_name} ${employee.last_name}`}
                </label>
              </div>
              <div className="text-sm text-gray-500 text-right">
                <div>הכשרות: {getEmployeeQualificationsCount(employee._id)}</div>
                <div>ממוצע הכשרות: {getEmployeeAverageQualification(employee._id)}</div>
                {assignedEmployees[employee._id] && (
                  <div>
                    הוקצה ל: {assignedEmployees[employee._id].stationName}
                    <br />
                    ציון הכשרה: {assignedEmployees[employee._id].qualificationScore.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="p-3 text-gray-500 text-sm">לא נמצאו עובדים.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeSelector;