// components/EmployeeCard.jsx
import React, { useEffect, useState } from "react";
import EditEmployeeForm from "./EditEmployeeForm";
import { useMe } from "@hooks/useMe";
import { http } from "../../api/http";

function Row({ label, value, full = false, children }) {
  return (
    <div className={`border rounded-lg p-3 ${full ? "sm:col-span-2" : ""}`}>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      {children ? (
        children
      ) : (
        <div className="font-semibold break-words">{value ?? "-"}</div>
      )}
    </div>
  );
}

const EmployeeCard = ({ employee, onUpdateEmployee }) => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { me, loading } = useMe();
  const isAdmin = !!me?.isAdmin;

  // NEW: stations & averages for this employee
  const [stations, setStations] = useState([]); // ["ישר-אסיפות", ...]
  const [stationAverages, setStationAverages] = useState({}); // { "ישר-אסיפות": 92, ... }
  const person_id = employee?.person_id;

  useEffect(() => {
    let cancelled = false;
    async function fetchQualifications() {
      if (!person_id) return;
      try {
        const { data } = await http.get(`/qualifications/${person_id}`);
        if (cancelled) return;
        setStations(data.map((q) => q.station_name));
        const map = {};
        data.forEach((q) => {
          map[q.station_name] = q.avg;
        });
        setStationAverages(map);
      } catch (e) {
        console.error("Failed to load qualifications", e);
        setStations([]);
        setStationAverages({});
      }
    }
    fetchQualifications();
    return () => {
      cancelled = true;
    };
  }, [person_id]);

  if (!employee) {
    return (
      <div className="text-center text-gray-500">No employee selected</div>
    );
  }

  const displayName =
    `${employee.first_name ?? ""} ${employee.last_name ?? ""}`.trim() ||
    employee.username ||
    employee.person_id;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 my-6">
      <h2 className="text-2xl font-bold mb-4">{displayName}</h2>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Row label="Employee ID / person_id" value={employee.person_id} />
        <Row label="Username" value={employee.username} />
        <Row label="First name / שם פרטי" value={employee.first_name} />
        <Row label="Last name / שם משפחה" value={employee.last_name} />
        <Row label="Email / מייל" value={employee.email} />
        <Row label="Phone / טלפון" value={employee.phone} />
        <Row label="Department / מחלקה" value={employee.department} />
        <Row label="Role / תפקיד" value={employee.role} />
        <Row label="Status / סטטוס" value={employee.status} />
        <Row label="Admin / מנהל" value={employee.isAdmin ? "כן" : "לא"} />

        {/* NEW: Stations list (read-only display) */}
        <Row label="Stations / עמדות" full>
          {stations.length === 0 ? (
            <div className="text-gray-500">אין עמדות מקושרות</div>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {stations.map((s) => (
                <li
                  key={s}
                  className="px-3 py-1 rounded-full text-sm border bg-gray-50"
                  title={
                    stationAverages[s] != null
                      ? `Avg: ${stationAverages[s]}`
                      : undefined
                  }
                >
                  {s}
                  {stationAverages[s] != null ? ` · ${stationAverages[s]}` : ""}
                </li>
              ))}
            </ul>
          )}
        </Row>
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
          onUpdateEmployee={(updated) => {
            // pass upwards
            onUpdateEmployee?.(updated);
            // also refresh displayed stations after edit if you want:
            // (relying on EditEmployeeForm to upsert quals already)
          }}
          // NEW: pass initial stations & their averages
          initialStations={stations}
          initialStationAverages={stationAverages}
        />
      )}
    </div>
  );
};

export default EmployeeCard;
