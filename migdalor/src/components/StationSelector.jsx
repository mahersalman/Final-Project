import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

const StationSelector = ({ selectedStations, onChange }) => {
  const [stationOptions, setStationOptions] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/stations');
        console.log('API response:', response.data);
        setStationOptions(response.data.map(station => station.station_name));
        console.log('Stations:', response.data.map(station => station.station_name));
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    };
  
    fetchStations();
  }, []);

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
        {stationOptions.length > 0 ? (
          stationOptions.map((station, index) => (
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
          ))
        ) : (
          <p>No stations found. Raw data: {JSON.stringify(stationOptions)}</p>
        )}
      </div>
    </div>
  );
};

export default StationSelector;