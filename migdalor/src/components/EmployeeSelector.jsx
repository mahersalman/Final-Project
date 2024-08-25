import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeSelector = ({ selectedEmployees, onChange, maxSelections, selectedStation }) => {
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [qualifications, setQualifications] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch employees with qualifications for the selected station
  useEffect(() => {
    const fetchEmployeesAndQualifications = async () => {
      if (selectedStation) {
        setIsLoading(true);
        setError(null);
        try {
          const [employeesResponse, qualificationsResponse] = await Promise.all([
            axios.get(`http://localhost:5001/api/employees-with-qualifications/${selectedStation.station_name}`),
            axios.get(`http://localhost:5001/api/qualifications/${selectedStation.station_name}`)
          ]);

          console.log('Employees data:', employeesResponse.data);
          console.log('Qualifications data:', qualificationsResponse.data);

          setEmployeeOptions(employeesResponse.data);

          const qualificationsData = qualificationsResponse.data.reduce((acc, qual) => {
            acc[qual.person_id] = qual.avg;
            return acc;
          }, {});

          console.log('Processed qualifications data:', qualificationsData);

          setQualifications(qualificationsData);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to fetch employee data and qualifications');
        } finally {
          setIsLoading(false);
        }
      } else {
        setEmployeeOptions([]);
        setQualifications({});
      }
    };
    fetchEmployeesAndQualifications();
  }, [selectedStation]);

  // Handle checkbox changes
  const handleCheckboxChange = (employeeId) => {
    const updatedEmployees = selectedEmployees.includes(employeeId)
      ? selectedEmployees.filter(id => id !== employeeId)
      : [...selectedEmployees, employeeId];
    
    if (updatedEmployees.length <= maxSelections) {
      onChange(updatedEmployees);
    }
  };

  // Helper function to get employee qualification average
  const getEmployeeQualificationAverage = (employeeId) => {
    console.log(`Getting qualification for employee ${employeeId}:`, qualifications[employeeId]);
    return qualifications[employeeId] !== undefined ? qualifications[employeeId] : 'N/A';
  };

  // Render component
  return (
    <div className="mb-6">
      <label className="block text-lg font-semibold mb-3">עובדים ({selectedEmployees.length}/{maxSelections}):</label>
      <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-white">
        {isLoading ? (
          <p className="p-3 text-gray-500 text-sm">טוען נתונים...</p>
        ) : error ? (
          <p className="p-3 text-red-500 text-sm">{error}</p>
        ) : selectedStation ? (
          employeeOptions.length > 0 ? (
            employeeOptions.map((employee) => {
              console.log('Rendering employee:', employee);
              const avgQualification = getEmployeeQualificationAverage(employee.person_id);
              console.log(`Average qualification for ${employee.first_name} ${employee.last_name}:`, avgQualification);
              
              return (
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
                    <div>ממוצע: {avgQualification}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="p-3 text-gray-500 text-sm">לא נמצאו עובדים מוכשרים לעמדה זו.</p>
          )
        ) : (
          <p className="p-3 text-gray-500 text-sm">אנא בחר עמדה תחילה.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeSelector;