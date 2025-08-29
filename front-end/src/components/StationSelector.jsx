import { useState, useEffect } from "react";
import axios from "axios";
import serverUrl from "@config/api";

const StationSelector = ({
  selectedStations,
  onChange,
  onAverageChange,
  initialAverages,
}) => {
  const [stationOptions, setStationOptions] = useState([]);
  const [averages, setAverages] = useState(initialAverages || {});

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/stations`);
        setStationOptions(response.data.map((station) => station.station_name));
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    setAverages(initialAverages || {});
  }, [initialAverages]);

  const handleCheckboxChange = (station) => {
    const updatedStations = selectedStations.includes(station)
      ? selectedStations.filter((s) => s !== station)
      : [...selectedStations, station];
    onChange(updatedStations);
  };

  const handleAverageChange = (station, value) => {
    const updatedAverages = { ...averages, [station]: value };
    setAverages(updatedAverages);
    onAverageChange(updatedAverages);
  };

  return (
    <div className="mb-6">
      <label className="block text-lg font-semibold mb-3">תחנות עבודה:</label>
      <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-white">
        {stationOptions.length > 0 ? (
          stationOptions.map((station, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`station-${index}`}
                  value={station}
                  checked={selectedStations.includes(station)}
                  onChange={() => handleCheckboxChange(station)}
                  className="form-checkbox h-5 w-5 text-[#1F6231] rounded border-gray-300 focus:ring-[#1F6231] transition duration-150 ease-in-out"
                />
                <label
                  htmlFor={`station-${index}`}
                  className="ml-3 text-sm font-medium text-gray-700"
                >
                  {station}
                </label>
              </div>
              <input
                type="number"
                placeholder="ממוצע יומי"
                value={averages[station] || 0}
                onChange={(e) => handleAverageChange(station, e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 w-28 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6231] focus:border-transparent transition duration-150 ease-in-out"
              />
            </div>
          ))
        ) : (
          <p className="p-3 text-gray-500 text-sm">לא נמצאו תחנות.</p>
        )}
      </div>
    </div>
  );
};

export default StationSelector;
