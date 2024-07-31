import React from 'react';

const EmployeeCard = ({ employee }) => {
  if (!employee) {
    return <div className="text-center text-gray-500">No employee selected</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">{`${employee.first_name} ${employee.last_name}`}</h2>
      <p className="text-gray-600 mb-2">תעודת זהות: {employee.person_id}</p>
      <p className="text-gray-600 mb-2">מחלקה: {employee.department}</p>
      <p className="text-gray-600 mb-2">טלפון: {employee.phone}</p>
      <p className="text-gray-600 mb-2">תאריך לידה: {new Date(employee.birth_date).toLocaleDateString()}</p>
    </div>
  );
};

export default EmployeeCard;