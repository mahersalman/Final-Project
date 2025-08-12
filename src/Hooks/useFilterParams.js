import { useSearchParams } from "react-router-dom";

export default function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = (key, fallback) => {
    const v = searchParams.get(key);
    return v === null || v === "" ? fallback : v;
  };

  const department = get("dept", "all");
  const status = get("status", "all");
  const name = get("name", "");

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const setDepartment = (val) => updateParam("dept", val);
  const setStatus = (val) => updateParam("status", val);
  const setName = (val) => updateParam("name", val?.trim() ?? "");

  const clearAll = () => setSearchParams({}, { replace: true });

  return {
    department,
    status,
    name,
    setDepartment,
    setStatus,
    setName,
    clearAll,
  };
}
