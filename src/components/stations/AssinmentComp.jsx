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
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [assignmentMessage, setAssignmentMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchEmployees();
        await fetchAssignments();
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/employees');
      setEmployees(response.data);
    } catch (err) {
      throw new Error('Failed to fetch employees');
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/assignments?date=${selectedDate}`);
      setAssignments(response.data);
    } catch (err) {
      throw new Error('Failed to fetch assignments');
    }
  };

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

        const existingAssignments = assignments.filter(a => a.person_id === employee.person_id);
        
        if (existingAssignments.length === 0) {
          await saveAssignmentToDB(employee, newAssignment.assignment1, 1);
          message += `נוסף שיבוץ ראשון ל${newAssignment.fullName}. `;
        } else if (existingAssignments.length === 1) {
          await saveAssignmentToDB(employee, newAssignment.assignment1, 2);
          message += `נוסף שיבוץ שני ל${newAssignment.fullName}. `;
        } else {
          message += `ל${newAssignment.fullName} כבר יש שני שיבוצים. `;
        }
      }

      await fetchAssignments(); // Refresh assignments after adding new ones
      setAssignmentMessage(message || 'השיבוצים נוספו בהצלחה');
    } catch (error) {
      console.error('Error submitting assignments:', error);
      setError('Failed to submit assignments');
    } finally {
      setIsLoading(false);
      onCloseForm();
    }
  };

  const saveAssignmentToDB = async (employee, workingStation, assignmentNumber) => {
    try {
      const assignmentData = {
        date: selectedDate,
        workingStation_name: workingStation,
        person_id: employee.person_id,
        number_of_hours: 4
      };

      const response = await axios.post('http://localhost:5001/api/assignments', assignmentData);
      console.log(`Assignment ${assignmentNumber} saved:`, response.data);
    } catch (error) {
      console.error('Error saving assignment to DB:', error);
      throw error;
    }
  };

  const handleDeleteAssignment = async (personId, assignmentId) => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/assignments/${assignmentId}`);
  
      if (response.status === 200) {
        const employee = employees.find(e => e.person_id === personId);
        const fullName = employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown';
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

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['שם ושם משפחה', 'שיבוץ 1', 'שיבוץ 2'],
      ...employees.map(employee => {
        const employeeAssignments = assignments.filter(a => a.person_id === employee.person_id);
        return [
          `${employee.first_name} ${employee.last_name}`,
          employeeAssignments[0]?.workingStation_name || '',
          employeeAssignments[1]?.workingStation_name || ''
        ];
      })
    ]);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Assignments");
    XLSX.writeFile(workbook, `Assignments_${selectedDate}.xlsx`);
  };

  if (isLoading) return <div>טוען...</div>;
  
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
              {employees.map((employee) => {
                const employeeAssignments = assignments.filter(a => a.person_id === employee.person_id);
                return (
                  <tr key={employee.person_id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 text-right">{`${employee.first_name} ${employee.last_name}`}</td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-right">{employeeAssignments[0]?.workingStation_name || ''}</span>
                        {employeeAssignments[0] && (
                          <button
                            onClick={() => handleDeleteAssignment(employee.person_id, employeeAssignments[0].id)}
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
                        <span className="text-right">{employeeAssignments[1]?.workingStation_name || ''}</span>
                        {employeeAssignments[1] && (
                          <button
                            onClick={() => handleDeleteAssignment(employee.person_id, employeeAssignments[1].id)}
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