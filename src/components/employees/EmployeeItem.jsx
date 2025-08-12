import React, { useState, useEffect, useMemo } from "react";
import EmployeeCard from "./EmployeeCard";
import AddEmployeeForm from "./AddEmployeeForm";
import DepartmentDropdown from "../DepartmentDropdown";
import StatusDropdown from "../StatusDropdown";
import NameSearch from "../NameSearch";
import EmployeeList from "../EmployeeList";
import { FaFileExcel } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import * as XLSX from "xlsx";
import axios from "axios";
import serverUrl from "config/api";
import useFilterParams from "../../Hooks/useFilterParams";

const EmployeeItem = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // read-only here; controls update them themselves
  const { department, status, name, clearAll } = useFilterParams();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${serverUrl}/api/employees`);
        setEmployees(data || []);
      } catch {
        setError("Failed to fetch employees");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filteredEmployees = useMemo(() => {
    const term = (name || "").toLowerCase();
    return employees
      .filter((e) =>
        department === "all" ? true : e.department === department
      )
      .filter((e) => (status === "all" ? true : e.status === status))
      .filter((e) => {
        if (!term) return true;
        const full = [e.first_name, e.last_name, e.name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return full.includes(term);
      });
  }, [employees, department, status, name]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredEmployees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpdateEmployee = async (updated) => {
    try {
      await axios.put(
        `${serverUrl}/api/employees/${updated.person_id}`,
        updated
      );
      setEmployees((prev) =>
        prev.map((e) => (e.person_id === updated.person_id ? updated : e))
      );
      if (selectedEmployee?.person_id === updated.person_id) {
        setSelectedEmployee(updated);
      }
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col lg:flex-row p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="w-full lg:w-1/3 xl:w-1/4 mb-6 lg:mb-0">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">עובדים</h1>

        {/* Mobile toggle */}
        <button
          className="lg:hidden mb-4 inline-flex items-center gap-2 px-3 py-2 rounded border bg-white"
          onClick={() => setMobileFiltersOpen((v) => !v)}
        >
          <FiFilter /> סינון
        </button>

        <div
          className={`${
            mobileFiltersOpen ? "block" : "hidden"
          } lg:block bg-white p-3 rounded shadow-sm`}
        >
          <h2 className="font-semibold mb-3">סינון עובדים</h2>

          <div className="flex flex-col lg:flex-row lg:items-end gap-3">
            <div className="flex-1">
              <label className="block mb-1 text-sm">לפי מחלקה</label>
              <DepartmentDropdown includeAllOption className="w-full p-2" />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm">לפי סטטוס</label>
              <StatusDropdown includeAllOption className="w-full p-2" />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm">לפי שם עובד</label>
              <NameSearch className="w-full" />
            </div>
            <div className="flex-none">
              <button
                onClick={clearAll}
                className="w-full lg:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-3 rounded"
              >
                נקה סינון
              </button>
            </div>
          </div>
        </div>

        <div className="h-[50vh] lg:h-[calc(80vh-200px)] min-w-[250px] mt-4">
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

      <div className="hidden lg:block lg:w-8" />

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
          onAddEmployee={(e) =>
            setEmployees((prev) => [...prev, { ...e, id: prev.length + 1 }])
          }
        />
      )}
    </div>
  );
};

export default EmployeeItem;
