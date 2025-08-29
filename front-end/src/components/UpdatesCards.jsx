import { useState, useEffect, useMemo } from "react";
import serverUrl from "@config/api";
import { useNavigate, createSearchParams, Link } from "react-router-dom";

// static meta
const SECTIONS_META = [
  {
    key: "inactiveWorkers",
    name: "עובדים לא פעילים",
    color: "#FDF5F5",
    to: () => ({
      pathname: "/employees",
      search: `?${createSearchParams({ status: "לא פעיל" })}`,
    }),
  },
  {
    key: "activeWorkers",
    name: "עובדים פעילים",
    color: "#E9F7F5",
    to: () => ({
      pathname: "/employees",
      search: `?${createSearchParams({ status: "פעיל" })}`,
    }),
  },
  {
    key: "dailyDefects",
    name: "מס' פגומים יומי",
    color: "#F5F8FD",
    to: null,
  },
  {
    key: "inactiveStations",
    name: "עמדות לא פעילות",
    color: "#FDFCF5",
    to: null,
  },
];
const UpdatesSection = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    inactiveWorkers: 0,
    activeWorkers: 0,
    dailyDefects: 0,
    inactiveStations: 0,
  });
  const [error, setError] = useState(null);
  const sections = useMemo(
    () =>
      SECTIONS_META.map((m) => ({
        ...m,
        value: values[m.key] ?? 0,
      })),
    [values]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/dashboard-data`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        setValues({
          inactiveWorkers: data.inactiveWorkers ?? 0,
          activeWorkers: data.activeWorkers ?? 0,
          dailyDefects: data.dailyDefects ?? 0,
          inactiveStations: data.inactiveStations ?? 0,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-5 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section, index) => {
          const canNavigate = typeof section.to === "function";
          const handleClick = () => {
            if (!canNavigate) return;
            const to = section.to();
            navigate(to);
          };

          return (
            <div
              key={index}
              className="rounded-lg p-5 flex flex-col justify-between items-center text-center"
              style={{ backgroundColor: section.color }}
            >
              <h2 className="text-lg text-gray-800 mb-5">{section.name}</h2>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold mb-1">{section.value}</span>
                {section.today && (
                  <span className="text-sm">{section.today}</span>
                )}
              </div>

              {canNavigate ? (
                <button
                  onClick={handleClick}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none underline"
                >
                  צפייה בפרטים &#x3E;
                </button>
              ) : (
                // If there's no target, show disabled look or hide:
                <span className="mt-2 text-sm text-gray-400 cursor-not-allowed">
                  אין פרטים
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpdatesSection;
