import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportDisplay = ({
  reportData,
  reportType,
  station,
  date,
  startDate,
  endDate,
  employee,
}) => {
  if (!reportData) return null;

  const isArray = Array.isArray(reportData);
  const isDaily = (reportType || "").startsWith("daily");

  const dateStr = date ? date.toLocaleDateString("he-IL") : "";
  const rangeStr =
    startDate && endDate
      ? `${startDate.toLocaleDateString(
          "he-IL"
        )} - ${endDate.toLocaleDateString("he-IL")}`
      : "";

  const baseOptions = (titleText) => ({
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: titleText },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { stacked: false },
      y: { stacked: false, beginAtZero: true, precision: 0 },
    },
  });

  // ---------- DAILY ----------
  const renderDailyReport = () => {
    const goodValves = Number(reportData?.goodValves ?? 0);
    const invalidValves = Number(reportData?.invalidValves ?? 0);
    const total = goodValves + invalidValves;
    const goodPct = total ? ((goodValves / total) * 100).toFixed(2) : "0.00";
    const badPct = total ? ((invalidValves / total) * 100).toFixed(2) : "0.00";

    const labels = [dateStr || rangeStr || ""];

    const data = {
      labels,
      datasets: [
        { label: "תקין", data: [goodValves], backgroundColor: "#4CAF50" },
        { label: "לא תקין", data: [invalidValves], backgroundColor: "#F44336" },
      ],
    };

    return (
      <div>
        <h3>
          דוח יומי {dateStr ? `- ${dateStr}` : rangeStr ? `- ${rangeStr}` : ""}
        </h3>
        {station && <p>תחנה: {station}</p>}
        {employee && <p>עובד: {employee}</p>}
        <Bar data={data} options={baseOptions("דוח יומי")} />
        <div className="mt-4">
          <p>סה"כ רכיבים: {total}</p>
          <p>
            רכיבים תקינים: {goodValves} ({goodPct}%)
          </p>
          <p>
            רכיבים לא תקינים: {invalidValves} ({badPct}%)
          </p>
        </div>
      </div>
    );
  };

  // ---------- RANGE / MONTHLY ----------
  const renderRangeReport = () => {
    // normalize to rows
    const rows = isArray
      ? reportData
      : reportData && typeof reportData === "object"
      ? [
          {
            _id: dateStr || rangeStr || "סה״כ",
            goodValves: Number(reportData.goodValves ?? 0),
            invalidValves: Number(reportData.invalidValves ?? 0),
          },
        ]
      : [];

    const labels = rows.map((r) => r._id);
    const goodVals = rows.map((r) => Number(r.goodValves ?? 0));
    const badVals = rows.map((r) => Number(r.invalidValves ?? 0));

    // totals for the summary panel
    const totalGood = goodVals.reduce((a, b) => a + b, 0);
    const totalBad = badVals.reduce((a, b) => a + b, 0);
    const total = totalGood + totalBad;
    const goodPct = total ? ((totalGood / total) * 100).toFixed(2) : "0.00";
    const badPct = total ? ((totalBad / total) * 100).toFixed(2) : "0.00";

    const data = {
      labels,
      datasets: [
        { label: "תקין", data: goodVals, backgroundColor: "#4CAF50" },
        { label: "לא תקין", data: badVals, backgroundColor: "#F44336" },
      ],
    };

    return (
      <div>
        <h3>
          דוח {rangeStr ? `(${rangeStr})` : "חודשי"}{" "}
          {station ? `- ${station}` : ""}
        </h3>
        {employee && <p>עובד: {employee}</p>}
        <Bar data={data} options={baseOptions("דוח תקופתי")} />
        {/* SUMMARY FOR RANGE, always visible */}
        <div className="mt-4">
          <p>סה"כ רכיבים: {total}</p>
          <p>
            רכיבים תקינים: {totalGood} ({goodPct}%)
          </p>
          <p>
            רכיבים לא תקינים: {totalBad} ({badPct}%)
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="report-container">
      {isDaily ? renderDailyReport() : renderRangeReport()}
    </div>
  );
};

export default ReportDisplay;
