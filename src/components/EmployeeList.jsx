import React, { useMemo, useState } from "react";

const PAGE_SIZE = 12;

const EmployeeList = ({
  filteredEmployees = [],
  selectedEmployee,
  setSelectedEmployee,
}) => {
  const [page, setPage] = useState(1); // 1-based

  const total = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Clamp page if filters change
  if (page > totalPages) {
    setPage(totalPages);
  }

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredEmployees.slice(start, end);
  }, [filteredEmployees, page]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="bg-gray-50 border-b px-4 py-2 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">
            רשימת עובדים ({total})
          </h2>
        </div>
      </div>

      {/* List: only 10 items */}
      <div className="flex-grow bg-white rounded-b-lg shadow">
        {total === 0 ? (
          <p className="p-4 text-center text-gray-500">לא נמצאו עובדים</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pageItems.map((emp, idxOnPage) => {
              const key =
                emp._id ??
                emp.person_id ??
                `${emp.first_name}-${emp.last_name}-${idxOnPage}`;
              const isSelected =
                selectedEmployee &&
                (selectedEmployee._id ?? selectedEmployee.person_id) ===
                  (emp._id ?? emp.person_id);

              const absoluteIndex = (page - 1) * PAGE_SIZE + idxOnPage;

              return (
                <li
                  key={key}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`flex items-center justify-between cursor-pointer px-4 py-3 transition ${
                    isSelected
                      ? "bg-[#246B35] text-white"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                        isSelected
                          ? "bg-white text-[#246B35]"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {absoluteIndex + 1}
                    </span>
                    <span>
                      {emp.first_name} {emp.last_name}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Slider pager (mobile-friendly) */}
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-white border-t rounded-b-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              disabled={page === 1}
              className={`px-3 py-1 rounded border ${
                page === 1
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              -
            </button>

            <input
              type="range"
              min={1}
              max={totalPages}
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
              className="flex-1"
            />

            <button
              onClick={goNext}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded border ${
                page === totalPages
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              +
            </button>
          </div>
          <div className="text-center text-xs text-gray-500 mt-1">
            מציג {Math.min((page - 1) * PAGE_SIZE + 1, total)}–
            {Math.min(page * PAGE_SIZE, total)} מתוך {total}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
