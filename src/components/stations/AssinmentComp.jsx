import React, { useState, useEffect } from 'react';
import { CalendarIcon, Trash2, FileDown } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import AddAssignmentForm from './AddAssignmentForm';

// Alert component for displaying messages
const Alert = ({ children, type = 'info' }) => {
  const bgColor = type === 'error' ? 'bg-red-100' : 'bg-yellow-100';
  const borderColor = type === 'error' ? 'border-red-500' : 'border-yellow-500';
  const textColor = type === 'error' ? 'text-red-700' : 'text-yellow-700';

  return (
    <div className={`${bgColor} border-l-4 ${borderColor} ${textColor} p-4 mb-4`} role="alert">
      {children}
    </div>
  );
};

// DatePicker component
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

// Main AssignmentComp component
const AssignmentComp = ({ selectedStation, showForm, onCloseForm }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [employees, setEmployees] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [assignmentMessage, setAssignmentMessage] = useState('');

  // Fetch employees and assignments on component mount and when date changes
  useEffect(() => {
    fetchEmployees();
    fetchAssignments();
  }, [selectedDate]);

  // Function to fetch employees from the server
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

  // Function to fetch assignments for the selected date
  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5001/api/assignments?date=${selectedDate}`);
      const fetchedAssignments = response.data.reduce((acc, assignment) => {
        const employee = employees.find(e => e.person_id === assignment.person_id);
        if (employee) {
          const fullName = `${employee.first_name} ${employee.last_name}`;
          if (!acc[fullName]) {
            acc[fullName] = { assignment1: '', assignment2: '' };
          }
          if (!acc[fullName].assignment1) {
            acc[fullName].assignment1 = assignment.workingStation_name;
          } else {
            acc[fullName].assignment2 = assignment.workingStation_name;
          }
        }
        return acc;
      }, {});
      setAssignments({ [selectedDate]: Object.entries(fetchedAssignments).map(([fullName, assignments]) => ({ fullName, ...assignments })) });
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch assignments');
      setIsLoading(false);
    }
  };

  // Function to handle new assignment submissions
  const handleAssignmentSubmit = async (newAssignments) => {
    try {
      setIsLoading(true);
      let message = '';

      for (const newAssignment of newAssignments) {
        const employee = employees.find(e => `${e.first_name} ${e.last_name}` === newAssignment.fullName);
        if (!employee) {
          message += `לא נמצא עובד בשם ${newAssignment.fullName}. `;
          continue;
        }

        const existingAssignments = assignments[selectedDate]?.find(a => a.fullName === newAssignment.fullName) || { assignment1: '', assignment2: '' };
        
        if (!existingAssignments.assignment1) {
          await saveAssignmentToDB(employee, newAssignment.assignment1, 1);
          message += `נוסף שיבוץ ראשון ל${newAssignment.fullName}. `;
        } else if (!existingAssignments.assignment2) {
          await saveAssignmentToDB(employee, newAssignment.assignment1, 2);
          message += `נוסף שיבוץ שני ל${newAssignment.fullName}. `;
        } else {
          message += `ל${newAssignment.fullName} כבר יש שני שיבוצים. `;
        }
      }

      await fetchAssignments(); // Refresh assignments after adding new ones
      setAssignmentMessage(message || 'השיבוצים נוספו בהצלחה');
      setIsLoading(false);
    } catch (error) {
      console.error('Error submitting assignments:', error);
      setError('Failed to submit assignments');
      setIsLoading(false);
    }
    onCloseForm();
  };

  // Function to save assignment to DB
  const saveAssignmentToDB = async (employee, workingStation, assignmentNumber) => {
    try {
      const assignmentData = {
        date: selectedDate,
        workingStation_name: workingStation,
        person_id: employee.person_id,
        number_of_hours: 8 // You might want to make this dynamic
      };

      const response = await axios.post('http://localhost:5001/api/assignments', assignmentData);
      console.log(`Assignment ${assignmentNumber} saved:`, response.data);
    } catch (error) {
      console.error('Error saving assignment to DB:', error);
      throw error;
    }
  };

  // Function to handle assignment deletion
  const handleDeleteAssignment = async (fullName, assignmentNumber) => {
    try {
      const employee = employees.find(e => `${e.first_name} ${e.last_name}` === fullName);
      if (!employee) {
        throw new Error('Employee not found');
      }
  
      const response = await axios.delete('http://localhost:5001/api/assignments', {
        data: {
          date: selectedDate,
          person_id: employee.person_id,
          assignmentNumber: assignmentNumber
        }
      });
  
      if (response.status === 200) {
        // Handle successful deletion
        setAssignmentMessage(`השיבוץ של ${fullName} נמחק בהצלחה.`);
        await fetchAssignments(); // Refresh assignments
      } else {
        throw new Error('Failed to delete assignment');
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError('Failed to delete assignment: ' + error.message);
    }
  };

  // Function to export assignments to Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['שם ושם משפחה', 'שיבוץ 1', 'שיבוץ 2'],
      ...employees.map(employee => {
        const fullName = `${employee.first_name} ${employee.last_name}`;
        const assignment = assignments[selectedDate]?.find(a => a.fullName === fullName);
        return [
          fullName,
          assignment?.assignment1 || '',
          assignment?.assignment2 || ''
        ];
      })
    ]);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Assignments");
    XLSX.writeFile(workbook, `Assignments_${selectedDate}.xlsx`);
  };

  // Render loading state
  if (isLoading) return <div>טוען...</div>;
  
  // Main component render
  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">טבלת שיבוץ יומי</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <button
          onClick={exportToExcel}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <FileDown className="mr-2" />
          ייצא לאקסל
        </button>
      </div>
      <div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="font-bold mb-4 text-lg sm:text-xl text-gray-700">
          שיבוץ ליום {new Date(selectedDate).toLocaleDateString('he-IL')}
        </h2>
        {error && <Alert type="error">{error}</Alert>}
        {assignmentMessage && <Alert>{assignmentMessage}</Alert>}
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
                    <td className="border border-gray-300 p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-right">{assignment?.assignment1 || ''}</span>
                        {assignment?.assignment1 && (
                          <button
                            onClick={() => handleDeleteAssignment(fullName, 1)}
                            className="text-red-600 hover:text-red-800 ml-2"
                            title="מחק שיבוץ"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-right">{assignment?.assignment2 || ''}</span>
                        {assignment?.assignment2 && (
                          <button
                            onClick={() => handleDeleteAssignment(fullName, 2)}
                            className="text-red-600 hover:text-red-800 ml-2"
                            title="מחק שיבוץ"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
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