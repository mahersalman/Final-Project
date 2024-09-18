import React, { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import axios from 'axios';
import AddAssignmentForm from './AddAssignmentForm';

// Simple Alert component
const Alert = ({ children }) => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
    {children}
  </div>
);

const DatePicker = ({ selectedDate, onDateChange }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-white border border-gray-300 rounded-md p-2 shadow-sm hover:border-blue-500 transition-colors duration-200">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-gray-400" size={20} />
            <label htmlFor="datePicker" className="text-gray-700 font-medium">בחר תאריך:</label>
          </div>
          <input
            id="datePicker"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="outline-none border-none bg-transparent text-gray-800 font-semibold w-full sm:w-auto"
          />
        </div>
    );
};

const AssignmentComp = ({ selectedStation, showForm, onCloseForm }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [employees, setEmployees] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [assignmentMessage, setAssignmentMessage] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:5001/api/employees');
            setEmployees(response.data);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to fetch employees');
            setIsLoading(false);
        }
    };

    const handleAssignmentSubmit = (newAssignments) => {
        setAssignments(prevAssignments => {
            const updatedAssignments = { ...prevAssignments };
            if (!updatedAssignments[selectedDate]) {
                updatedAssignments[selectedDate] = [];
            }
            
            let message = '';
            newAssignments.forEach(newAssignment => {
                const existingIndex = updatedAssignments[selectedDate].findIndex(
                    a => a.fullName === newAssignment.fullName
                );
                if (existingIndex !== -1) {
                    // Update existing assignment
                    if (!updatedAssignments[selectedDate][existingIndex].assignment2) {
                        updatedAssignments[selectedDate][existingIndex].assignment2 = newAssignment.assignment1;
                    } else {
                        message += `ל${newAssignment.fullName} כבר יש שני שיבוצים. `;
                    }
                } else {
                    // Add new assignment
                    updatedAssignments[selectedDate].push(newAssignment);
                }
            });
            
            setAssignmentMessage(message);
            return updatedAssignments;
        });
        onCloseForm();
    };

    if (isLoading) return <div>טוען...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-4 sm:p-6 bg-gray-50 rounded-lg shadow-md">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">טבלת שיבוץ יומי</h1>
            <DatePicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
            />
            <div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="font-bold mb-4 text-lg sm:text-xl text-gray-700">
                    שיבוץ ליום {new Date(selectedDate).toLocaleDateString('he-IL')}
                </h2>
                {assignmentMessage && (
                    <Alert>{assignmentMessage}</Alert>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-right">שם ושם משפחה</th>
                                <th className="border border-gray-300 p-2 text-right">שיבוץ 1</th>
                                <th className="border border-gray-300 p-2 text-right">שיבוץ 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee, index) => {
                                const fullName = `${employee.first_name} ${employee.last_name}`;
                                const assignment = assignments[selectedDate]?.find(a => a.fullName === fullName);
                                return (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 p-2 text-right">{fullName}</td>
                                        <td className="border border-gray-300 p-2 text-right">{assignment?.assignment1 || ''}</td>
                                        <td className="border border-gray-300 p-2 text-right">{assignment?.assignment2 || ''}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {showForm && (
                <AddAssignmentForm
                    onClose={onCloseForm}
                    onSubmit={handleAssignmentSubmit}
                    selectedStation={selectedStation}
                    selectedDate={selectedDate}
                />
            )}
        </div>
    );
};

export default AssignmentComp;