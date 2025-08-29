import { useState, useEffect } from "react";
import DepartmentDropdown from "../DepartmentDropdown";
import ProductDropdown from "../ProductDropdown";
import axios from "axios";
import { Filter, Loader } from "lucide-react";
import serverUrl from "@config/api";

const StationItem = ({ onSelectStation, onAssignmentButtonClick, isAdmin }) => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stations, setStations] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${serverUrl}/api/stations`);
      setStations(response.data);
      setIsLoading(false);
    } catch {
      setError("Failed to fetch stations");
      setIsLoading(false);
    }
  };

  const filteredStations = stations.filter((station) => {
    if (selectedDepartment === "all" && selectedProduct === "all") {
      return true;
    } else if (selectedDepartment === "all") {
      return station.product_name === selectedProduct;
    } else if (selectedProduct === "all") {
      return station.department === selectedDepartment;
    } else {
      return (
        station.department === selectedDepartment &&
        station.product_name === selectedProduct
      );
    }
  });

  const handleStationClick = (station) => {
    setSelectedStation(station);
    onSelectStation(station);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500 mr-2" size={24} />
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500 bg-red-100 border border-red-400 rounded-md">
        <p className="font-semibold">Error: {error}</p>
        <p className="mt-2">Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 max-w-full sm:max-w-md mx-auto flex flex-col h-[500px] sm:h-[700px]">
      <div className="flex-none">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 text-center">
          עמדות
        </h1>
        <div className="mb-4 sm:mb-6 bg-gray-100 p-3 sm:p-4 rounded-md">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center">
            <Filter className="mr-2" size={18} />
            סינון
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                סינון לפי מחלקה
              </label>
              <DepartmentDropdown
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                includeAllOption={true}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                סינון לפי מוצר
              </label>
              <ProductDropdown
                value={selectedProduct}
                onChange={handleProductChange}
                includeAllOption={true}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <ul className="space-y-2">
          {filteredStations.map((station) => (
            <li
              key={station._id}
              onClick={() => handleStationClick(station)}
              className={`cursor-pointer p-2 sm:p-3 rounded-md shadow transition duration-150 ease-in-out ${
                selectedStation && selectedStation._id === station._id
                  ? "bg-[#246B35] text-white"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="font-medium text-sm sm:text-base">
                {station.station_name}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                {station.department} - {station.product_name}
              </div>
            </li>
          ))}
        </ul>

        {filteredStations.length === 0 && (
          <p className="text-center text-gray-500 mt-4 text-sm sm:text-base">
            No stations found matching the current filters.
          </p>
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={() => isAdmin && onAssignmentButtonClick()}
          className={`w-full font-bold py-2 px-4 rounded flex items-center justify-center ${
            selectedStation && isAdmin
              ? "bg-[#1F6231] hover:bg-[#309d49] text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedStation || !isAdmin}
          title={!isAdmin ? "Admins only" : ""}
        >
          ביצוע שיבוץ
        </button>
      </div>
    </div>
  );
};

export default StationItem;
