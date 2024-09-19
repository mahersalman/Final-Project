import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportDisplay = ({ reportData, reportType, station, date, employee }) => {
  if (!reportData) return null;

  const renderDailyReport = () => {
    const { goodValves, invalidValves } = reportData;
    const total = goodValves + invalidValves;
    const goodPercentage = ((goodValves / total) * 100).toFixed(2);
    const invalidPercentage = ((invalidValves / total) * 100).toFixed(2);

    const data = {
      labels: ['תקין', 'לא תקין'],
      datasets: [
        {
          data: [goodValves, invalidValves],
          backgroundColor: ['#4CAF50', '#F44336'],
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'דוח יומי',
        },
      },
    };

    return (
      <div>
        <h3>דוח יומי - {date.toLocaleDateString('he-IL')}</h3>
        <p>תחנה: {station}</p>
        {employee && <p>עובד: {employee}</p>}
        <Bar data={data} options={options} />
        <div className="mt-4">
          <p>סה"כ רכיבים: {total}</p>
          <p>רכיבים תקינים: {goodValves} ({goodPercentage}%)</p>
          <p>רכיבים לא תקינים: {invalidValves} ({invalidPercentage}%)</p>
        </div>
      </div>
    );
  };

  const renderMonthlyReport = () => {
    const labels = reportData.map(item => item._id);
    const goodValvesData = reportData.map(item => item.goodValves);
    const invalidValvesData = reportData.map(item => item.invalidValves);

    const data = {
      labels,
      datasets: [
        {
          label: 'תקין',
          data: goodValvesData,
          backgroundColor: '#4CAF50',
        },
        {
          label: 'לא תקין',
          data: invalidValvesData,
          backgroundColor: '#F44336',
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'דוח חודשי',
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    };

    return (
      <div>
        <h3>דוח חודשי - {station}</h3>
        <Bar data={data} options={options} />
      </div>
    );
  };

  return (
    <div className="report-container">
      {reportType === 'daily' ? renderDailyReport() : renderMonthlyReport()}
    </div>
  );
};

export default ReportDisplay;