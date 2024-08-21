import React, { useState, useEffect } from 'react';
import DepartmentDropdown from '../DepartmentDropdown';
import ProductDropdown from '../ProductDropdown';
import axios from 'axios';


const StationItem = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [stations, setStations] = useState([]);
    const [error, setError] = useState(null);
  
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
        const response = await axios.get('http://localhost:5000/api/stations');
        setStations(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch employees');
        setIsLoading(false);
      }
    };
  
    const filteredStations = stations.filter((station) => {
      if (selectedDepartment === 'all' && selectedProduct === 'all') {
        return true;
      } else if (selectedDepartment === 'all') {
        return station.product_name === selectedProduct;
      } else if (selectedProduct === 'all') {
        return station.department === selectedDepartment;
      } else {
        return station.department === selectedDepartment && station.product_name === selectedProduct;
      }
    });
  
    if (isLoading) {
      return <div className="text-center p-4">Loading...</div>;
    }
  
    if (error) {
      return <div className="text-center p-4 text-red-500">Error: {error}</div>;
    }
  
    return (
      <div className="flex p-6 bg-gray-100 min-h-screen">
        <div className="w-1/3 pr-6">
          <h1 className="text-3xl font-bold mb-4">עמדות ושיבוץ</h1>
          <label>סינון לפי מחלקה </label>
          <DepartmentDropdown
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            includeAllOption={true}
            className="p-1 m-1"
          />
          <label>סינון לפי מוצר </label>
          <ProductDropdown
            value={selectedProduct}
            onChange={handleProductChange}
            includeAllOption={true}
            className="p-1 m-1"
          />
          <ul className="space-y-2">
            {filteredStations.map((station) => (
              <li
                key={station._id}
                onClick={() => setSelectedDepartment(station)}
                className={`cursor-pointer p-3 rounded shadow transition duration-150 ease-in-out ${
                  selectedDepartment && selectedDepartment._id === station._id
                    ? 'bg-[#246B35] text-white'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                {station.station_name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  export default StationItem;