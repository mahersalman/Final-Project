import React, { useState, useMemo } from 'react';

const EmployeeList = ({ filteredEmployees, selectedEmployee, setSelectedEmployee }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchedEmployees = useMemo(() => {
    return filteredEmployees.filter(emp => 
      emp.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredEmployees, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="חיפוש עובד..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow">
        {searchedEmployees.length === 0 ? (
          <p className="p-4 text-center text-gray-500">לא נמצאו עובדים</p>
        ) : (
          <ul className="space-y-2 p-2">
            {searchedEmployees.map((emp) => (
              <li
                key={emp._id}
                onClick={() => setSelectedEmployee(emp)}
                className={`cursor-pointer p-3 rounded transition duration-150 ease-in-out ${
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
  );
};

export default EmployeeList;