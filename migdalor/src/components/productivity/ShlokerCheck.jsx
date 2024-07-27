import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement } from 'chart.js';

ChartJS.register(ArcElement);

function ShlokerCheck() {
  const [counterData, setCounterData] = useState({
    proper: 0,
    improper: 0,
  });

  useEffect(() => {
    // Mock data source
    const mockData = {
      proper: 0,
      improper: 0,
    };

    const intervalId = setInterval(() => {
      mockData.proper += Math.random() * 3;
      mockData.improper += Math.random();
      setCounterData({ ...mockData });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  const chartData = {
    labels: ['Proper', 'Improper'],
    datasets: [
      {
        data: [counterData.proper, counterData.improper],
        backgroundColor: ['green', 'red'],
      },
    ],
  };

  return (
   <div className="flex flex-col items-center">
   <div className="flex w-full justify-center">
     <div className="flex items-center justify-center w-1/2 bg-blue-100 p-4">
       <h2 className="text-xl font-bold">Proper Items: {counterData.proper}</h2>
     </div>
     <div className="flex items-center justify-center w-1/2 bg-green-100 p-4">
       <h2 className="text-xl font-bold">Improper Items: {counterData.improper}</h2>
     </div>
   </div>
   <div className="w-60 h-60">
     <Pie data={chartData} />
   </div>
 </div>
  );
}

export default ShlokerCheck;


// import React, { useState, useEffect } from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement } from 'chart.js';
// import mqtt from 'mqtt'; // Replace 'mqtt' with your actual MQTT client library

// ChartJS.register(ArcElement);

// function CounterAndPieChart() {
//   const [counterData, setCounterData] = useState({
//     proper: 0,
//     improper: 0,
//   });

//   useEffect(() => {
//     // MQTT client setup (replace with your actual client)
//     const client = mqtt.connect('your-mqtt-broker-url');

//     const subscribe = () => {
//       client.subscribe('your-mqtt-topic');
//       client.on('message', (topic, message) => {
//         const data = JSON.parse(message.toString());
//         setCounterData({
//           proper: data.proper,
//           improper: data.improper,
//         });
//       });
//     };

//     subscribe();

//     // Unsubscribe and disconnect client on component unmount
//     return () => {
//       client.unsubscribe('your-mqtt-topic');
//       client.end();
//     };
//   }, []);

//   const chartData = {
//     labels: ['Proper', 'Improper'],
//     datasets: [
//       {
//         data: [counterData.proper, counterData.improper],
//         backgroundColor: ['green', 'red'],
//       },
//     ],
//   };

//   return (
//     <div>
//       <h2>Proper Items: {counterData.proper}</h2>
//       <h2>Improper Items: {counterData.improper}</h2>
//       <Pie data={chartData} />
//     </div>
//   );
// }

// export default CounterAndPieChart;
