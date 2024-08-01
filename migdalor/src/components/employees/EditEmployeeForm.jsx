import React, { useState } from 'react';
import DepartmentDropdown from '../DepartmentDropdown';
import StationSelector from '../StationSelector';

const EditEmployeeForm = ({ employee, onClose, onUpdateEmployee }) => {
  const [department, setDepartment] = useState(employee.department);
  const [stations, setStations] = useState(employee.stations || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateEmployee({ department, stations });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-2/5 p-6 rounded-lg relative">
        <h2 className="text-2xl font-bold mb-4">עריכת פרטי עובד</h2>
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
          />

          <div className="flex justify-between">
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
            >
              עדכן פרטים
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeForm;