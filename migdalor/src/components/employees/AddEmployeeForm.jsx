import React, { useState } from 'react';
import DepartmentDropdown from '../DepartmentDropdown'
import StationSelector from '../StationSelector';

const AddEmployeeForm = ({ onClose, onAddEmployee }) => {
  const [fname, setFName] = useState('');  
  const [lname, setLName] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState('');
  const [bdate, setBdate] = useState('');
  const [stations, setStations] = useState([]); // State for selected stations


  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEmployee({ fname, lname, department, phone });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-2/5 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">הוספת עובד חדש</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">שם פרטי:</label>
            <input
              type="text"
              placeholder='ישראל'
              value={fname}
              onChange={(e) => setFName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">שם משפחה:</label>
            <input
              type="text"
              placeholder='ישראלי'
              value={lname}
              onChange={(e) => setLName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">תעודת זהות:</label>
            <input
              type="number"
              placeholder='111111111'
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
          <label>בחירת מחלקה: </label>
          <DepartmentDropdown
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2"
          />
          </div>
          <StationSelector
            selectedStations={stations}
            onChange={setStations}
          />
          <div className="mb-4">
            <label className="block mb-2">טלפון:</label>
            <input
              type="tel"
              placeholder='052-1234-123'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">תאריך לידה:</label>
            <input
              type="date"
              value={bdate}
              onChange={(e) => setBdate(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 rounded"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#1F6231] border-none relative pointer hover:bg-[#309d49] text-white"
            >
              הוסף עובד
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;