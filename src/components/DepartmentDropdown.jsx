import React from "react";
import useFilterParams from "../Hooks/useFilterParams";

const departments = [
  "הרכבות 1",
  "הרכבות 2",
  "טלפוניה",
  "הרכבות אלקטרוניקה",
  "פלקס",
  "פרמהספט",
];

const DepartmentDropdown = ({
  value,
  onChange,
  includeAllOption = false,
  className = "",
}) => {
  const { department, setDepartment } = useFilterParams();
  const val = value ?? department;

  const handle = (e) => {
    const v = e.target.value;
    if (onChange) onChange(e);
    else setDepartment(v); // updates URL
  };

  return (
    <select
      value={val}
      onChange={handle}
      className={`border rounded ${className}`}
    >
      {includeAllOption && <option value="all">כל המחלקות</option>}
      {departments.map((d) => (
        <option key={d} value={d}>
          {d}
        </option>
      ))}
    </select>
  );
};

export default DepartmentDropdown;
