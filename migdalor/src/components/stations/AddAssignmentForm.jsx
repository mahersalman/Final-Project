import React, { useState } from 'react';
import EmployeeSelector from '../EmployeeSelector';

const AddAssignmentForm = ({ onClose }) => {
    const [employeeCount, setEmployeeCount] = useState(1);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [employeeHours, setEmployeeHours] = useState({});

    const handleEmployeeCountChange = (e) => {
        const count = parseInt(e.target.value);
        setEmployeeCount(count);
        // Reset selected employees if the new count is less than current selections
        setSelectedEmployees(prev => prev.slice(0, count));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log("Selected Employees:", selectedEmployees);
        console.log("Employee Hours:", employeeHours);
        // Close the form after submission
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">טופס שיבוץ</h2>
                <form onSubmit={handleSubmit}>
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
                        onChange={setSelectedEmployees}
                        onHoursChange={setEmployeeHours}
                        initialHours={employeeHours}
                        maxSelections={employeeCount}
                    />
                    <div className="flex items-center justify-between">
                        <button 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                            type="submit"
                        >
                            שמור שיבוץ
                        </button>
                        <button 
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                            type="button" 
                            onClick={onClose}
                        >
                            סגור
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAssignmentForm;