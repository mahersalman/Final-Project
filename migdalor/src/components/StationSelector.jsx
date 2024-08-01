// StationSelector.js
import React from 'react';

const StationSelector = ({ selectedStations, onChange }) => {
  const stationOptions = [
    'תחנה 1',
    'תחנה 2',
    'תחנה 3',
    'תחנה 4',
    'תחנה 5',
  ];

  const handleCheckboxChange = (station) => {
    const updatedStations = selectedStations.includes(station)
      ? selectedStations.filter(s => s !== station)
      : [...selectedStations, station];
    onChange(updatedStations);
  };

  return (
    <div className="mb-4">
      <label className="block mb-2">תחנות עבודה:</label>
      <div className="max-h-40 overflow-y-auto border p-2 rounded">
        {stationOptions.map((station, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`station-${index}`}
              value={station}
              checked={selectedStations.includes(station)}
              onChange={() => handleCheckboxChange(station)}
              className="mr-2"
            />
            <label htmlFor={`station-${index}`}>{station}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StationSelector;