import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeSelector = ({ selectedEmployees, onChange, maxSelections }) => {
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [qualifications, setQualifications] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/employees');
        setEmployeeOptions(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/qualifications');
        const qualificationsData = response.data.reduce((acc, qual) => {
          if (!acc[qual.person_id]) {
            acc[qual.person_id] = 0;
          }
          acc[qual.person_id]++;
          return acc;
        }, {});
        setQualifications(qualificationsData);
      } catch (error) {
        console.error('Error fetching qualifications:', error);
      }
    };
    fetchQualifications();
  }, []);

  const handleCheckboxChange = (employeeId) => {
    const updatedEmployees = selectedEmployees.includes(employeeId)
      ? selectedEmployees.filter(id => id !== employeeId)
      : [...selectedEmployees, employeeId];
    
    if (updatedEmployees.length <= maxSelections) {
      onChange(updatedEmployees);
    }
  };

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
                <label htmlFor={`employee-${employee._id}`} className="ml-3 text-sm font-medium text-gray-700">
                  {`${employee.first_name} ${employee.last_name} - ${employee.role}`}
                </label>
              </div>
              <span className="text-sm font-medium text-gray-600">
                כישורים: {qualifications[employee.person_id] || 0}
              </span>
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