// src/components/ChartByEntry.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// Define your thresholds
const HIGH_THRESHOLD = 140;
const LOW_THRESHOLD = 70;

// Helper to determine color based on glucose level
const getPointColor = (glucoseLevel) => {
  const level = Number(glucoseLevel);
  if (isNaN(level)) return 'gray'; // fallback color for invalid data
  if (level > HIGH_THRESHOLD) return 'red';
  if (level < LOW_THRESHOLD) return 'blue';
  return 'green';
};

const ChartByEntry = ({ logs }) => {
  if (!Array.isArray(logs) || logs.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No data available for chart.</p>;
  }

  // Filter out logs that don't have the required fields
  const validLogs = logs.filter(log => log && log.timestamp && log.glucoseLevel);

  if (validLogs.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No valid entries to display.</p>;
  }

  // Ensure logs are sorted by timestamp ascending
  const sortedLogs = [...validLogs].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const data = {
    labels: sortedLogs.map(log =>
      new Date(log.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Glucose Level',
        data: sortedLogs.map(log => Number(log.glucoseLevel)),
        borderColor: 'gray',
        pointBackgroundColor: sortedLogs.map(log =>
          getPointColor(log.glucoseLevel)
        ),
        pointRadius: 5,
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Glucose: ${context.parsed.y} mg/dL`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Glucose (mg/dL)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mt-6">
      <Line data={data} options={options} />
    </div>
  );
};

export default ChartByEntry;
