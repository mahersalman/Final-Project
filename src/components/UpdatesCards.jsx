import React, { useState, useEffect } from 'react';

const UpdatesSection = () => {
  const [sections, setSections] = useState([
    { name: "עובדים לא פעילים", value: 0, color: "#FDF5F5" },
    { name: "עובדים פעילים", value: 0, color: "#E9F7F5", today: "+0 today" },
    { name: "מס' פגומים יומי", value: 0, color: "#F5F8FD" },
    { name: "עמדות לא פעילות", value: 0, color: "#FDFCF5" }
  ]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching dashboard data...');
        const response = await fetch('/api/dashboard-data');
        console.log('Response status:', response.status);
        
        // Log the raw response text
        const rawText = await response.text();
        console.log('Raw response:', rawText);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse the response text as JSON
        const data = JSON.parse(rawText);
        console.log('Parsed data:', data);

        setSections(prevSections => [
          { ...prevSections[0], value: data.inactiveWorkers },
          { ...prevSections[1], value: data.activeWorkers, today: `+${data.newActiveWorkers} today` },
          { ...prevSections[2], value: data.dailyDefects },
          { ...prevSections[3], value: data.inactiveStations }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

{/*  if (error) {
    return <div>Error: {error}</div>;
  }*/}

  return (
    <div className="p-5 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section, index) => (
          <div 
            key={index} 
            className="rounded-lg p-5 flex flex-col justify-between items-center text-center" 
            style={{ backgroundColor: section.color }}
          >
            <h2 className="text-lg text-gray-800 mb-5">{section.name}</h2>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold mb-1">{section.value}</span>
              {section.today && <span className="text-sm">{section.today}</span>}
            </div>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none">
              צפייה בפרטים &#x3E;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdatesSection;