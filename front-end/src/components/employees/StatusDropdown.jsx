import React from "react";
import { status } from "@constants/status";

const StatusDropdown = ({ value, onChange, className = "" }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`border rounded ${className}`}
    >
      {status.map((sta) => (
        <option key={sta} value={sta}>
          {sta}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;
