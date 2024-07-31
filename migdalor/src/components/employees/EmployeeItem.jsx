import React, { useState } from 'react';
import EmployeeCard from './EmployeeCard';
import AddEmployeeForm from './AddEmployeeForm';
import * as XLSX from 'xlsx';

const EmployeeItem = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", department: "Developer", phone: "123-456-7890" },
    { id: 2, name: "Jane Smith", department: "Designer", phone: "098-765-4321" },
    { id: 3, name: "Bob Johnson", department: "Manager", phone: "555-555-5555" },
  ]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

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

  return (
    <div className="flex p-6 bg-gray-100 min-h-screen">
      <div className="w-1/3 pr-6">
        <h1 className="text-3xl font-bold mb-4">עובדים</h1>
        <label>סינון עובדים לפי מחלקה </label>
        <select value={selectedDepartment} onChange={handleDepartmentChange}>
          <option value="all">כל המחלקות</option>
          {[...new Set(employees.map(emp => emp.department))].map(department => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
        <ul className="space-y-2">
          {filteredEmployees.map((emp) => (
            <li
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className={`cursor-pointer p-3 rounded shadow transition duration-150 ease-in-out ${
                selectedEmployee && selectedEmployee.id === emp.id
                  ? 'bg-[#246B35] text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {emp.name}
            </li>
          ))}
        </ul>
        <button
          onClick={exportToExcel}
          className="my-4 bg-[#1F6231] border-none relative pointer hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded"
        >
          ייצא ל-Excel
        </button>
      </div>
      <div className="w-2/3">
        <EmployeeCard employee={selectedEmployee} />
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


//----------------------------------------------------------------For get employees details from data base----------------------------------------------------------------
// import React, { useState, useEffect } from 'react';
// import EmployeeCard from './EmployeeCard';
// import * as XLSX from 'xlsx';

// const EmployeeItem = () => {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       setIsLoading(true);
//       // Replace this URL with your actual API endpoint
//       const response = await fetch('mongodb+srv://eden011096:<password>@migdalor.uqujiwf.mongodb.net/');
//       if (!response.ok) {
//         throw new Error('Failed to fetch employees');
//       }
//       const data = await response.json();
//       setEmployees(data);
//       setIsLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setIsLoading(false);
//     }
//   };

//   const exportToExcel = () => {
//     const workSheet = XLSX.utils.json_to_sheet(employees);
//     const workBook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workBook, workSheet, "Employees");
    
//     // Generate buffer
//     const excelBuffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
    
//     // Save to file
//     const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     const url = window.URL.createObjectURL(data);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'employees.xlsx');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (isLoading) {
//     return <div className="text-center p-4">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center p-4 text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="flex p-6 bg-gray-100 min-h-screen">
//       <div className="w-1/3 pr-6">
//         <h1 className="text-3xl font-bold mb-4">Employee Directory</h1>
//         <button 
//           onClick={exportToExcel}
//           className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Export to Excel
//         </button>
//         <ul className="space-y-2">
//           {employees.map(emp => (
//             <li 
//               key={emp.id} 
//               onClick={() => setSelectedEmployee(emp)}
//               className="cursor-pointer p-3 bg-white rounded shadow hover:bg-gray-50 transition duration-150 ease-in-out"
//             >
//               {emp.name}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="w-2/3">
//         <h2 className="text-2xl font-bold mb-4">Employee Details</h2>
//         <EmployeeCard employee={selectedEmployee} />
//       </div>
//     </div>
//   );
// };

// export default EmployeeItem;