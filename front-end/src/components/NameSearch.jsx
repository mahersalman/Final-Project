import React, { useState, useEffect } from "react";
import useFilterParams from "@hooks/useFilterParams";

export default function NameSearch({ value, onChange, className = "" }) {
  const { name, setName } = useFilterParams();
  const [local, setLocal] = useState(value ?? name);

  // keep local in sync with URL (e.g., back/forward nav)
  useEffect(() => {
    if (value === undefined) setLocal(name);
  }, [name, value]);

  const commit = (v) => {
    if (onChange) onChange(v);
    else setName(v);
  };

  return (
    <input
      type="text"
      value={value ?? local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={(e) => commit(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit(e.currentTarget.value);
      }}
      placeholder="חפש לפי שם…"
      className={`w-full p-2 border rounded ${className}`}
    />
  );
}
