import React from "react";
import useFilterParams from "@hooks/useFilterParams";
const statuses = ["פעיל", "לא פעיל", "מוקפא"];

export default function StatusDropdown({
  value,
  onChange,
  includeAllOption = false,
  className = "",
}) {
  const { status, setStatus } = useFilterParams();
  const val = value ?? status;

  const handle = (e) => {
    const v = e.target.value;
    if (onChange) onChange(e);
    else setStatus(v);
  };

  return (
    <select
      value={val}
      onChange={handle}
      className={`border rounded ${className}`}
    >
      {includeAllOption && <option value="all">כל הסטטוסים</option>}
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
