// components/EmployeeCard.jsx
import React, { useState } from "react";
import EditEmployeeForm from "./EditEmployeeForm";
import { useMe } from "../../hooks/useMe";

function Row({ label, value, full = false }) {
  return (
    <div className={`border rounded-lg p-3 ${full ? "sm:col-span-2" : ""}`}>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="font-semibold break-words">{value ?? "-"}</div>
    </div>
  );
}

const EmployeeCard = ({ employee, onUpdateEmployee }) => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { me, loading } = useMe();

  if (!employee) {
    return (
      <div className="text-center text-gray-500">No employee selected</div>
    );
  }

  const isAdmin = !!me?.isAdmin;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 my-6">
      <h2 className="text-2xl font-bold mb-4">
        {`${employee.first_name ?? ""} ${employee.last_name ?? ""}`.trim() ||
          employee.username ||
          employee.person_id}
      </h2>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Row label="Employee ID / person_id" value={employee.person_id} />
        <Row label="Username" value={employee.username} />
        <Row label="First name / שם פרטי" value={employee.first_name} />
        <Row label="Last name / שם משפחה" value={employee.last_name} />
        <Row label="Email / מייל" value={employee.email} full />
        <Row label="Phone / טלפון" value={employee.phone} />
        <Row label="Department / מחלקה" value={employee.department} />
        <Row label="Role / תפקיד" value={employee.role} />
        <Row label="Status / סטטוס" value={employee.status} />
        <Row label="Admin / מנהל" value={employee.isAdmin ? "כן" : "לא"} />
      </div>

      {/* Edit button only for admins */}
      {!loading && isAdmin && (
        <button
          onClick={() => setIsEditFormOpen(true)}
          className="mt-2 bg-[#1F6231] hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded"
        >
          ערוך פרטים
        </button>
      )}

      {isEditFormOpen && isAdmin && (
        <EditEmployeeForm
          employee={employee}
          onClose={() => setIsEditFormOpen(false)}
          onUpdateEmployee={onUpdateEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeCard;
