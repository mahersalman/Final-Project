import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';

const ReportDisplay = ({ reportData, reportType }) => {
  if (!reportData || reportData.length === 0) {
    return <div>No data available for the selected criteria.</div>;
  }

  const renderMonthlyProductionChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={reportData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalProduction" stroke="#8884d8" name="Total Production" />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderWorkstationChart = () => (
    <div>
      {reportData.map((ws, index) => (
        <div key={index}>
          <h3>{ws.workstation}</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={ws.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="production" stroke="#82ca9d" name="Production" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );

  const renderDailyReport = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={reportData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );

  let chart;
  switch (reportType) {
    case 'monthly':
      chart = renderMonthlyProductionChart();
      break;
    case 'workstation':
      chart = renderWorkstationChart();
      break;
    case 'daily':
      chart = renderDailyReport();
      break;
    default:
      chart = <div>Invalid report type</div>;
  }

  return (
    <div>
      <h2>Production Report</h2>
      {chart}
    </div>
  );
};

export default ReportDisplay;