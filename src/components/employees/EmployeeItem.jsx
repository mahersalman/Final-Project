import React, { useState, useEffect } from 'react';
import EmployeeCard from './EmployeeCard';
import AddEmployeeForm from './AddEmployeeForm';
import DepartmentDropdown from '../DepartmentDropdown';
import EmployeeList from '../EmployeeList';
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
      const response = await axios.get('http://localhost:5001/api/employees');
      setEmployees(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setIsLoading(false);
    }
  };

  const handleUpdateEmployee = async (updatedEmployee) => {
    try {
      await axios.put(`http://localhost:5001/api/employees/${updatedEmployee.person_id}`, updatedEmployee);
      setEmployees(employees.map(emp => 
        emp.person_id === updatedEmployee.person_id ? updatedEmployee : emp
      ));
      if (selectedEmployee && selectedEmployee.person_id === updatedEmployee.person_id) {
        setSelectedEmployee(updatedEmployee);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const filteredEmployees = selectedDepartment === 'all'
    ? employees
    : employees.filter((emp) => emp.department === selectedDepartment);

  const exportToExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(filteredEmployees);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Employees");
    const excelBuffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
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
    <div className="flex flex-col lg:flex-row p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="w-full lg:w-1/3 xl:w-1/4 mb-6 lg:mb-0">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">עובדים</h1>
        <div className="mb-4">
          <label className="block mb-2">סינון עובדים לפי מחלקה</label>
          <DepartmentDropdown
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            includeAllOption={true}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="h-[50vh] lg:h-[calc(80vh-200px)] min-w-[250px]">
          <EmployeeList 
            filteredEmployees={filteredEmployees}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
          />
        </div>
        <button
          onClick={exportToExcel}
          className="mt-4 w-full flex items-center justify-center bg-[#1F6231] hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded"
        >
          <FaFileExcel className="mr-2" />
          ייצא ל-Excel
        </button>
      </div>

      {/* Spacer div for larger screens */}
      <div className="hidden lg:block lg:w-8"></div>
      
      <div className="w-full lg:w-2/3 xl:w-3/4 mt-6 lg:mt-0">
        <EmployeeCard 
          employee={selectedEmployee} 
          onUpdateEmployee={handleUpdateEmployee}
        />
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 w-full lg:w-auto bg-[#1F6231] hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded"
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