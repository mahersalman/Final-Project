import React from "react";

const EmployeeList = ({
  filteredEmployees,
  selectedEmployee,
  setSelectedEmployee,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="bg-gray-50 border-b px-4 py-2 rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-700">
          רשימת עובדים ({filteredEmployees.length})
        </h2>
      </div>

      {/* List */}
      <div className="flex-grow overflow-y-auto bg-white rounded-b-lg shadow">
        {!filteredEmployees || filteredEmployees.length === 0 ? (
          <p className="p-4 text-center text-gray-500">לא נמצאו עובדים</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredEmployees.map((emp, index) => {
              const key =
                emp._id ??
                emp.person_id ??
                `${emp.first_name}-${emp.last_name}`;
              const isSelected =
                selectedEmployee &&
                (selectedEmployee._id ?? selectedEmployee.person_id) ===
                  (emp._id ?? emp.person_id);

              return (
                <li
                  key={key}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`flex items-center justify-between cursor-pointer px-4 py-3 transition duration-150 ease-in-out ${
                    isSelected
                      ? "bg-[#246B35] text-white"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Row number */}
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                        isSelected
                          ? "bg-white text-[#246B35]"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </span>
                    {/* Name */}
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
    </div>
  );
};

export default EmployeeList;
