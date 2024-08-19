import React, { useState, useEffect } from 'react';
import EmployeeCard from './EmployeeCard';
import AddEmployeeForm from './AddEmployeeForm';
import DepartmentDropdown from '../DepartmentDropdown';
import { FaFileExcel } from "react-icons/fa";
import * as XLSX from 'xlsx';
import axios from 'axios';

const EmployeeItem = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setIsLoading(false);
    }
  };

  const handleUpdateEmployee = async (updatedEmployee) => {
    try {
      // Update the employee in the database
      await axios.put(`http://localhost:5000/api/employees/${updatedEmployee._id}`, updatedEmployee);
      
      // Update the local state
      setEmployees(employees.map(emp => 
        emp._id === updatedEmployee._id ? updatedEmployee : emp
      ));
      
      // Update the selected employee if it's the one that was updated
      if (selectedEmployee && selectedEmployee._id === updatedEmployee._id) {
        setSelectedEmployee(updatedEmployee);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      // You might want to show an error message to the user here
    }
  };

  const filteredEmployees = selectedDepartment === 'all'
    ? employees
    : employees.filter((emp) => emp.department === selectedDepartment);

  const exportToExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(filteredEmployees);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Employees");
    
    // Generate buffer
    const excelBuffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
    
    // Save to file
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, { ...newEmployee, id: employees.length + 1 }]);
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex p-6 bg-gray-100 min-h-screen">
      <div className="w-1/3 pr-6">
        <h1 className="text-3xl font-bold mb-4">עובדים</h1>
        <label>סינון עובדים לפי מחלקה </label>
        <DepartmentDropdown
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          includeAllOption={true}
          className="p-1 m-1"
        />
        <ul className="space-y-2">
          {filteredEmployees.map((emp) => (
            <li
              key={emp._id}
              onClick={() => setSelectedEmployee(emp)}
              className={`cursor-pointer p-3 rounded shadow transition duration-150 ease-in-out ${
                selectedEmployee && selectedEmployee._id === emp._id
                  ? 'bg-[#246B35] text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {emp.first_name} {emp.last_name}
            </li>
          ))}
        </ul>
        <button
          onClick={exportToExcel}
          className="my-4 flex justify-between bg-[#1F6231] border-none relative pointer hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded"
        >
          <FaFileExcel />
          ייצא ל-Excel
        </button>
      </div>
      <div className="w-2/3 mx-16">
        <EmployeeCard 
          employee={selectedEmployee} 
          onUpdateEmployee={handleUpdateEmployee}
        />
        <button
          onClick={() => setShowAddForm(true)}
          className="my-4 bg-[#1F6231] border-none relative pointer hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded"
        >
          הוספת עובד חדש
        </button>
      </div>
      {showAddForm && (
        <AddEmployeeForm
          onClose={() => setShowAddForm(false)}
          onAddEmployee={handleAddEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeItem;