import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import serverUrl from "@config/api";

ChartJS.register(ArcElement, Tooltip, Legend);

function ShlokerCheck() {
  const [counterData, setCounterData] = useState({
    proper: 0,
    improper: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${serverUrl}/api/shluker-results`);
        console.log("Received data:", response.data);
        setCounterData(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching Shluker results:", error);
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Fetch immediately when component mounts
    const interval = setInterval(fetchData, 2 * 60 * 1000); // Fetch every 2 minutes

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: ["תקין", "פגום"],
    datasets: [
      {
        data: [counterData.proper, counterData.improper],
        backgroundColor: ["green", "red"],
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold pt-3">תוצרת יומית-בדיקת לחץ אוויר</h1>
      <div className="flex w-11/12 justify-center gap-9">
        <div className="flex items-center justify-center w-1/2 h-15 bg-green-100 p-4 rounded-lg m-5">
          <h2 className="text-xl font-bold">
            רכיבים תקינים: {counterData.proper}
          </h2>
        </div>
        <div className="flex items-center justify-center w-1/2 bg-red-100 p-4 rounded-lg m-5">
          <h2 className="text-xl font-bold">
            רכיבים פגומים: {counterData.improper}
          </h2>
        </div>
      </div>
      <div className="w-60 h-60">
        <Pie data={chartData} />
      </div>
    </div>
  );
}

export default ShlokerCheck;
