import React from 'react';

const EmployeeCard = ({ employee }) => {
  if (!employee) {
    return <div className="text-center text-gray-500">No employee selected</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">{employee.name}</h2>
      <p className="text-gray-600 mb-2">ID: {employee.id}</p>
      <p className="text-gray-600 mb-2">Department: {employee.department}</p>
     <p className="text-gray-600 mb-2">Phone: {employee.phone}</p>
    </div>
  );
};

export default EmployeeCard;