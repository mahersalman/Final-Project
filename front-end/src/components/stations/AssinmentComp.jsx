// components/stations/AssignmentComp.jsx
import React, { useState, useEffect, useCallback } from "react";
import { CalendarIcon, Trash2, FileDown } from "lucide-react";
import AddAssignmentForm from "./AddAssignmentForm";
import { http } from "../../api/http";
import { useMe } from "@hooks/useMe";

const Alert = ({ children, type = "info" }) => {
  const bgColor = type === "error" ? "bg-red-100" : "bg-yellow-100";
  const borderColor = type === "error" ? "border-red-500" : "border-yellow-500";
  const textColor = type === "error" ? "text-red-700" : "text-yellow-700";
  return (
    <div
      className={`${bgColor} border-l-4 ${borderColor} ${textColor} p-4 mb-4`}
      role="alert"
    >
      {children}
    </div>
  );
};

const DatePicker = ({ selectedDate, onDateChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-white border border-gray-300 rounded-md p-2 shadow-sm hover:border-blue-500 transition-colors duration-200">
      <div className="flex items-center gap-2">
        <CalendarIcon className="text-gray-400" size={20} />
        <label htmlFor="datePicker" className="text-gray-700 font-medium">
          בחר תאריך:
        </label>
      </div>
      <input
        id="datePicker"
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="outline-none border-none bg-transparent text-gray-800 font-semibold w-full sm:w-auto"
      />
    </div>
  );
};

/**
 * Props:
 *  - selectedStation
 *  - showForm
 *  - onCloseForm
 *  - isAdmin (optional) -> if not provided, inferred from useMe()
 */
const AssignmentComp = ({
  selectedStation,
  showForm,
  onCloseForm,
  isAdmin: isAdminProp,
}) => {
  const { me } = useMe();
  const isAdmin = isAdminProp ?? !!me?.isAdmin;

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignmentMessage, setAssignmentMessage] = useState("");

  const fetchEmployees = useCallback(async () => {
    const { data } = await http.get("/employees"); // if protected, token is sent
    setEmployees(data);
  }, []);

  const fetchAssignments = useCallback(async () => {
    const { data } = await http.get(`/assignments?date=${selectedDate}`);
    setAssignments(data);
  }, [selectedDate]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchEmployees();
        await fetchAssignments();
      } catch (err) {
        setError(
          "Failed to fetch data: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchEmployees, fetchAssignments]);

  const handleAssignmentSubmit = async (newAssignments) => {
    if (!isAdmin) {
      setError("רק מנהל יכול לבצע שיבוץ.");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      let message = "";

      for (const newAssignment of newAssignments) {
        const employee = employees.find(
          (e) => `${e.first_name} ${e.last_name}` === newAssignment.fullName
        );
        if (!employee) {
          message += `לא נמצא עובד בשם ${newAssignment.fullName}. `;
          continue;
        }

        const existingAssignments = assignments.filter(
          (a) => a.person_id === employee.person_id
        );

        // We still only add up to 2 per your original logic
        if (existingAssignments.length <= 1) {
          await saveAssignmentToDB(employee, newAssignment.assignment1);
          message += `נוסף שיבוץ ל${newAssignment.fullName}. `;
        } else {
          message += `ל${newAssignment.fullName} כבר יש שני שיבוצים. `;
        }
      }

      await fetchAssignments();
      setAssignmentMessage(message || "השיבוצים נוספו בהצלחה");
    } catch (error) {
      setError(
        "Failed to submit assignments: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
      onCloseForm?.();
    }
  };

  const saveAssignmentToDB = async (employee, workingStation) => {
    const assignmentData = {
      date: selectedDate,
      workingStation_name: workingStation,
      person_id: employee.person_id,
      number_of_hours: 4,
    };
    // admin-only route on server
    await http.post("/assignments", assignmentData);
  };

  const handleDeleteAssignment = async (fullName, assignmentIndex) => {
    if (!isAdmin) {
      setError("רק מנהל יכול למחוק שיבוץ.");
      return;
    }
    try {
      const employee = employees.find(
        (e) => `${e.first_name} ${e.last_name}` === fullName
      );
      if (!employee) throw new Error("Employee not found");

      const resp = await http.delete("/assignments", {
        data: {
          date: selectedDate,
          person_id: employee.person_id,
          assignmentNumber: assignmentIndex + 1,
        },
      });

      if (resp.status === 200) {
        setAssignmentMessage(`השיבוץ של ${fullName} נמחק בהצלחה.`);
        await fetchAssignments();
      } else {
        throw new Error("Failed to delete assignment");
      }
    } catch (error) {
      setError(
        "Failed to delete assignment: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const exportToCsv = () => {
    const rows = [
      ["שם ושם משפחה", "שיבוץ 1", "שיבוץ 2"],
      ...employees.map((employee) => {
        const employeeAssignments = assignments.filter(
          (a) => a.person_id === employee.person_id
        );
        return [
          `${employee.first_name} ${employee.last_name}`,
          employeeAssignments[0]?.workingStation_name || "",
          employeeAssignments[1]?.workingStation_name || "",
        ];
      }),
    ];

    // CSV escape
    const csv = rows
      .map((row) =>
        row
          .map((cell) => {
            const s = String(cell ?? "");
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Assignments_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  if (isLoading) return <div>טוען...</div>;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
        טבלת שיבוץ יומי
      </h1>

      {!isAdmin && (
        <Alert>מצב צפייה בלבד — רק מנהל יכול להוסיף או למחוק שיבוצים.</Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <button
          onClick={exportToCsv}
          className="bg-[#1F6231] hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <FileDown className="mr-2" />
          ייצא לאקסל
        </button>
      </div>

      <div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="font-bold mb-4 text-lg sm:text-xl text-gray-700">
          שיבוץ ליום {new Date(selectedDate).toLocaleDateString("he-IL")}
        </h2>

        {error && <Alert type="error">{error}</Alert>}
        {assignmentMessage && <Alert>{assignmentMessage}</Alert>}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-right">
                  שם ושם משפחה
                </th>
                <th className="border border-gray-300 p-2 text-right">
                  שיבוץ 1
                </th>
                <th className="border border-gray-300 p-2 text-right">
                  שיבוץ 2
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => {
                const employeeAssignments = assignments.filter(
                  (a) => a.person_id === employee.person_id
                );
                return (
                  <tr key={employee.person_id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 text-right">
                      {`${employee.first_name} ${employee.last_name}`}
                    </td>
                    {[0, 1].map((index) => (
                      <td key={index} className="border border-gray-300 p-2">
                        <div className="flex justify-between items-center">
                          <span className="text-right">
                            {employeeAssignments[index]?.workingStation_name ||
                              ""}
                          </span>
                          {isAdmin && employeeAssignments[index] && (
                            <button
                              onClick={() =>
                                handleDeleteAssignment(
                                  `${employee.first_name} ${employee.last_name}`,
                                  index
                                )
                              }
                              className="text-red-600 hover:text-red-800 ml-2"
                              title="מחק שיבוץ"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add form only for admins */}
      {isAdmin && showForm && (
        <AddAssignmentForm
          onClose={onCloseForm}
          onSubmit={handleAssignmentSubmit}
          selectedStation={selectedStation}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default AssignmentComp;
