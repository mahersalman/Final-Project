import { useState, useEffect } from "react";
import axios from "axios";
import serverUrl from "@config/api";

const EmployeeSelector = ({
  selectedEmployees,
  onChange,
  maxSelections,
  selectedStation,
}) => {
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log('EmployeeSelector - selectedEmployees:', selectedEmployees);
  }, [maxSelections, selectedEmployees]);

  useEffect(() => {
    const fetchSortedEmployees = async () => {
      if (selectedStation) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `${serverUrl}/api/sorted-employees/${selectedStation.station_name}`
          );
          setEmployeeOptions(response.data);
        } catch (error) {
          console.error("Error fetching sorted employees:", error);
          setError("Failed to fetch employee data");
        } finally {
          setIsLoading(false);
        }
      } else {
        setEmployeeOptions([]);
      }
    };
    fetchSortedEmployees();
  }, [selectedStation]);

  const handleCheckboxChange = (employee) => {
    const isSelected = selectedEmployees.some(
      (e) => e._doc._id === employee._doc._id
    );
    let updatedEmployees;
    if (isSelected) {
      updatedEmployees = selectedEmployees.filter(
        (e) => e._doc._id !== employee._doc._id
      );
    } else if (selectedEmployees.length < maxSelections) {
      updatedEmployees = [...selectedEmployees, employee];
    } else {
      return; // Do nothing if max selections reached
    }
    onChange(updatedEmployees);
  };

  return (
    <div className="mb-6">
      <label className="block text-lg font-semibold mb-3">
        עובדים מומלצים ({selectedEmployees.length}/{maxSelections}):
      </label>
      <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-white">
        {isLoading ? (
          <p className="p-3 text-gray-500 text-sm">טוען נתונים...</p>
        ) : error ? (
          <p className="p-3 text-red-500 text-sm">{error}</p>
        ) : selectedStation ? (
          employeeOptions.length > 0 ? (
            employeeOptions.map((employee, index) => (
              <div
                key={employee._doc._id}
                className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`employee-${employee._doc._id}`}
                    checked={selectedEmployees.some(
                      (e) => e._doc._id === employee._doc._id
                    )}
                    onChange={() => handleCheckboxChange(employee)}
                    disabled={
                      !selectedEmployees.some(
                        (e) => e._doc._id === employee._doc._id
                      ) && selectedEmployees.length >= maxSelections
                    }
                    className="form-checkbox h-5 w-5 text-[#1F6231] rounded border-gray-300 focus:ring-[#1F6231] transition duration-150 ease-in-out"
                  />
                  <label
                    htmlFor={`employee-${employee._doc._id}`}
                    className="mr-3 text-sm font-medium text-gray-700"
                  >
                    {`${employee._doc.first_name} ${employee._doc.last_name}`}
                  </label>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  <div>דירוג: {index + 1}</div>
                  <div>ממוצע: {employee.qualification.toFixed(2)}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="p-3 text-gray-500 text-sm">
              לא נמצאו עובדים מוכשרים לעמדה זו.
            </p>
          )
        ) : (
          <p className="p-3 text-gray-500 text-sm">אנא בחר עמדה תחילה.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeSelector;
