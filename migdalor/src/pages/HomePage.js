import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";

const UpdatesSection = () => {
  const sections = [
    { name: "עובדים לא פעילים", buttonText: "4", color: "#FDF5F5" },
    { name: "עובדים פעילים", buttonText: "41", color: "#E9F7F5", today: "+1 today" },
    { name: "מס' פגומים יומי", buttonText: "4", color: "#F5F8FD" },
    { name: "עמדות לא פעילות", buttonText: "4", color: "#FDFCF5" }
  ];

  return (
    <div className="p-5 font-sans">
      <div className="flex justify-between space-x-4">
        {sections.map((section, index) => (
          <div key={index} className="w-1/4 rounded-lg p-5 flex flex-col justify-between items-center text-center" style={{ backgroundColor: section.color }}>
            <h2 className="text-lg text-gray-800 mb-5">{section.name}</h2>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold mb-1">{section.buttonText}</span>
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

const DateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedDateTime = currentDateTime.toLocaleString("he-IL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="text-center text-2xl text-gray-700 my-4">
      {formattedDateTime}
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <DateTime />
      <UpdatesSection />
    </div>
  );
};

export default HomePage;