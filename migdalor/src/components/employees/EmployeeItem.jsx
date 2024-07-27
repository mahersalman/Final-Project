import React, { useState } from 'react';
import EmployeeCard from './EmployeeCard';

const EmployeeItem = () => {
  const [employees] = useState([
    { id: 1, name: "John Doe", department: "Developer", phone: "123-456-7890" },
    { id: 2, name: "Jane Smith", department: "Designer", phone: "098-765-4321" },
    { id: 3, name: "Bob Johnson", department: "Manager", phone: "555-555-5555" },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <div className="flex p-6 bg-gray-100 min-h-screen">
    <div className="w-1/3 pr-6">
      <h1 className="text-3xl font-bold mb-4">Employee Directory</h1>
      <ul className="space-y-2">
        {employees.map(emp => (
          <li 
            key={emp.id} 
            onClick={() => setSelectedEmployee(emp)}
            className={`cursor-pointer p-3 rounded shadow transition duration-150 ease-in-out
              ${selectedEmployee && selectedEmployee.id === emp.id 
                ? 'bg-[#246B35] text-white' 
                : 'bg-white hover:bg-gray-50'}`}
          >
            {emp.name}
          </li>
        ))}
      </ul>
    </div>
    <div className="w-2/3">
      <h2 className="text-2xl font-bold mb-4">Employee Details</h2>
      <EmployeeCard employee={selectedEmployee} />
    </div>
  </div>
  );
};

export default EmployeeItem;

//----------------------------------------------------------------For get employees details from data base----------------------------------------------------------------
{/* 
import React, { useState, useEffect } from 'react';
import EmployeeCard from './EmployeeCard';

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      // Replace this URL with your actual API endpoint
      const response = await fetch('https://your-api-endpoint.com/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex p-6 bg-gray-100 min-h-screen">
      <div className="w-1/3 pr-6">
        <h1 className="text-3xl font-bold mb-4">Employee Directory</h1>
        <ul className="space-y-2">
          {employees.map(emp => (
            <li 
              key={emp.id} 
              onClick={() => setSelectedEmployee(emp)}
              className="cursor-pointer p-3 bg-white rounded shadow hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              {emp.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/3">
        <h2 className="text-2xl font-bold mb-4">Employee Details</h2>
        <EmployeeCard employee={selectedEmployee} />
      </div>
    </div>
  );
};

export default EmployeeDirectory;
*/}