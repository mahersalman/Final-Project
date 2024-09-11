import React, { useState, useEffect } from 'react';
import EmployeeSelector from '../EmployeeSelector';

const AddAssignmentForm = ({ onClose, onSubmit, selectedStation, selectedDate }) => {
  const [employeeCount, setEmployeeCount] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    // console.log('AddAssignmentForm - Current employeeCount:', employeeCount);
    // console.log('AddAssignmentForm - Current selectedEmployees:', selectedEmployees);
  }, [employeeCount, selectedEmployees]);

  const handleEmployeeCountChange = (e) => {
    const count = parseInt(e.target.value);
    // console.log('AddAssignmentForm - New employee count selected:', count);
    setEmployeeCount(count);
    setSelectedEmployees(prev => {
      const updated = prev.slice(0, count);
      // console.log('AddAssignmentForm - Updated selectedEmployees after count change:', updated);
      return updated;
    });
  };

  const handleEmployeeSelection = (updatedEmployees) => {
    // console.log('AddAssignmentForm - Received updated employees:', updatedEmployees);
    setSelectedEmployees(updatedEmployees);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('AddAssignmentForm - Form submitted');
    // console.log('AddAssignmentForm - Final employeeCount:', employeeCount);
    // console.log('AddAssignmentForm - Final selectedEmployees:', selectedEmployees);
    const assignments = selectedEmployees.map(employee => ({
      fullName: `${employee._doc.first_name} ${employee._doc.last_name}`,
      assignment1: selectedStation.station_name,
      assignment2: ''
    }));
    onSubmit(assignments);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">טופס שיבוץ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-base sm:text-lg font-semibold">תאריך: {new Date(selectedDate).toLocaleDateString('he-IL')}</p>
            <p className="text-base sm:text-lg font-semibold">עמדה: {selectedStation?.station_name}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeCount">
              מספר העובדים לשיבוץ:
            </label>
            <select
              id="employeeCount"
              value={employeeCount}
              onChange={handleEmployeeCountChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
          </div>
          <EmployeeSelector
            selectedEmployees={selectedEmployees}
            onChange={handleEmployeeSelection}
            maxSelections={employeeCount}
            selectedStation={selectedStation}
          />
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
            <button
              className="w-full sm:w-auto px-4 py-2 mb-2 sm:mb-0 bg-gray-300 rounded text-sm font-medium hover:bg-gray-400 transition-colors"
              type="button"
              onClick={onClose}
            >
              סגור
            </button>
            <button
              className="w-full sm:w-auto px-4 py-2 rounded bg-[#1F6231] text-white text-sm font-medium hover:bg-[#309d49] transition-colors"
              type="submit"
              disabled={!selectedStation || selectedEmployees.length === 0}
            >
              שמור שיבוץ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignmentForm;