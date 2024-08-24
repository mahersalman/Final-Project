import React, { useState } from 'react';
import EditEmployeeForm from './EditEmployeeForm';

const EmployeeCard = ({ employee, onUpdateEmployee }) => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  if (!employee) {
    return <div className="text-center text-gray-500">No employee selected</div>;
  }

  const handleEditClick = () => {
    setIsEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
  };

  const handleUpdateEmployee = (updatedInfo) => {
    if (typeof onUpdateEmployee === 'function') {
      onUpdateEmployee({ ...employee, ...updatedInfo });
    } else {
      console.error('onUpdateEmployee is not a function', onUpdateEmployee);
    }
    setIsEditFormOpen(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg my-20">
      <h2 className="text-2xl font-bold mb-4">{`${employee.first_name} ${employee.last_name}`}</h2>
      <p className="text-gray-600 mb-2">תעודת זהות: {employee.person_id}</p>
      <p className="text-gray-600 mb-2">מחלקה: {employee.department}</p>
      <p className="text-gray-600 mb-2">סטטוס: {employee.status}</p>
      <button
        onClick={handleEditClick}
        className="my-4 bg-[#1F6231] border-none relative pointer hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded"
      >
        ערוך פרטים
      </button>
      {isEditFormOpen && (
        <EditEmployeeForm
          employee={employee}
          onClose={handleCloseEditForm}
          onUpdateEmployee={handleUpdateEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeCard;