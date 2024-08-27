import React, { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import AddAssignmentForm from './AddAssignmentForm';

const generateDummyData = (selectedDate, selectedStation) => {
  return [
    { id: 1, fullName: 'ישראל ישראלי', assignment1: 'עמדה 1', assignment2: 'עמדה 2' },
    { id: 2, fullName: 'שרה כהן', assignment1: 'עמדה 3', assignment2: 'עמדה 4' },
  ];
};

const DatePicker = ({ selectedDate, onDateChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-white border border-gray-300 rounded-md p-2 shadow-sm hover:border-blue-500 transition-colors duration-200">
      <div className="flex items-center gap-2">
        <CalendarIcon className="text-gray-400" size={20} />
        <label htmlFor="datePicker" className="text-gray-700 font-medium">בחר תאריך:</label>
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

const AssignmentComp = ({ selectedStation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setData(generateDummyData(selectedDate, selectedStation));
  }, [selectedDate, selectedStation]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg shadow-md relative">
      <button
        onClick={() => setShowForm(true)}
        className="mb-4 sm:mb-0 sm:absolute sm:top-4 sm:left-4 bg-[#1F6231] hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded flex items-center w-full sm:w-auto justify-center sm:justify-start"
      >
        ביצוע שיבוץ
      </button>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">טבלת שיבוץ יומי</h1>
      <DatePicker
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="font-bold mb-4 text-lg sm:text-xl text-gray-700">
          שיבוץ ליום {new Date(selectedDate).toLocaleDateString('he-IL')}
          {selectedStation && ` - ${selectedStation.station_name}`}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-right">שם ושם משפחה</th>
                <th className="border border-gray-300 p-2 text-right">שיבוץ 1</th>
                <th className="border border-gray-300 p-2 text-right">שיבוץ 2</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-right">{item.fullName}</td>
                  <td className="border border-gray-300 p-2 text-right">{item.assignment1}</td>
                  <td className="border border-gray-300 p-2 text-right">{item.assignment2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <AddAssignmentForm
          onClose={() => setShowForm(false)}
          selectedStation={selectedStation}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default AssignmentComp;