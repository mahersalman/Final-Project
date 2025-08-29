import React, { useState, useEffect, useMemo } from "react";
import EmployeeCard from "./EmployeeCard";
import AddUserEmployeeForm from "./AddUserEmployeeForm";
import DepartmentDropdown from "../DepartmentDropdown";
import StatusDropdown from "../StatusDropdown";
import NameSearch from "../NameSearch";
import EmployeeList from "../EmployeeList";
import { FaFileExcel } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import axios from "axios";
import serverUrl from "@config/api";
import useFilterParams from "@hooks/useFilterParams";
import { useMe } from "@hooks/useMe"; // add this if not already imported

const EmployeeItem = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { me } = useMe();

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

  const exportToCsv = () => {
    if (!filteredEmployees || filteredEmployees.length === 0) {
      return;
    }

    // 1. Build header row (keys of the object)
    const headers = Object.keys(filteredEmployees[0]);

    // 2. Build all rows (headers + values)
    const rows = [
      headers, // first row: column names
      ...filteredEmployees.map((emp) => headers.map((h) => emp[h] ?? "")),
    ];

    // 3. Convert to CSV string with proper escaping
    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => {
            const s = String(cell);
            // Escape if contains quotes, commas, or newlines
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(",")
      )
      .join("\n");

    // 4. Create blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
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
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-right">עובדים</h1>

      {/* Mobile filter toggle */}
      <button
        className="lg:hidden mb-4 inline-flex items-center gap-2 px-3 py-2 rounded border bg-white"
        onClick={() => setMobileFiltersOpen((v) => !v)}
      >
        <FiFilter /> סינון
      </button>

      {/* Full-width filter bar */}
      <div
        className={`${
          mobileFiltersOpen ? "block" : "hidden"
        } lg:block bg-white p-3 rounded shadow-sm mb-6`}
      >
        <h2 className="font-semibold mb-3 text-right">סינון עובדים</h2>
        <div className="flex flex-col lg:flex-row lg:items-end gap-3">
          <div className="flex-1">
            <label className="block mb-1 text-sm text-right">לפי מחלקה</label>
            <DepartmentDropdown includeAllOption className="w-full p-2" />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm text-right">לפי סטטוס</label>
            <StatusDropdown includeAllOption className="w-full p-2" />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm text-right">לפי שם עובד</label>
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
          <div className="flex-none">
            <button
              onClick={exportToCsv}
              className="w-full lg:w-auto flex items-center justify-center bg-[#1F6231] hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded"
            >
              <FaFileExcel className="mr-2" />
              ייצא ל-Excel
            </button>
          </div>
        </div>
      </div>

      {/* Main content grid — force LTR so col placement is reliable */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        dir="ltr"
      >
        {/* LEFT: EmployeeCard spans cols 1-2 */}
        <div dir="rtl" className="lg:col-span-2 lg:col-start-1">
          <div className=" rounded-lg shadow p-4 h-full">
            <EmployeeCard
              employee={selectedEmployee}
              onUpdateEmployee={handleUpdateEmployee}
            />
          </div>
        </div>

        {/* RIGHT: EmployeeList pinned to col 3 */}
        <div dir="rtl" className="lg:col-span-1 lg:col-start-3">
          <div className="min-w-[260px] bg-white rounded-lg shadow">
            <EmployeeList
              filteredEmployees={filteredEmployees}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
            />
          </div>
        </div>
      </div>

      {/* Big centered CTA at the bottom */}
      {me?.isAdmin && (
        <div className="sticky bottom-0 left-0 right-0 mt-6">
          <div className="max-w-7xl mx-auto px-4 pb-4">
            <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 rounded-xl shadow border p-3">
              <div className="flex justify-center">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center text-lg font-bold px-8 py-3 rounded-lg bg-[#1F6231] hover:bg-[#309d49] text-white transition"
                >
                  הוספת עובד חדש
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <AddUserEmployeeForm
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
