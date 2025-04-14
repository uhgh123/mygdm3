// src/components/ChartTrends.jsx
import React, { useState } from 'react';
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
import { groupBy } from 'lodash';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const ChartTrends = ({ logs }) => {
  const [trendType, setTrendType] = useState('weekly');

  const groupLogs = () => {
    return groupBy(logs, log => {
      const date = new Date(log.timestamp);
      if (trendType === 'weekly') {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay());
        return start.toISOString().split('T')[0];
      } else {
        return date.toISOString().slice(0, 7); // YYYY-MM
      }
    });
  };

  const grouped = groupLogs();

  const labels = Object.keys(grouped).sort();
  const dataPoints = labels.map(label => {
    const entries = grouped[label];
    const total = entries.reduce((sum, l) => sum + Number(l.glucoseLevel || 0), 0);
    return Number((total / entries.length).toFixed(1));
  });

  const data = {
    labels,
    datasets: [
      {
        label: `${trendType === 'weekly' ? 'Weekly' : 'Monthly'} Avg Glucose`,
        data: dataPoints,
        borderColor: 'gray',
        backgroundColor: 'lightgray',
        pointBackgroundColor: dataPoints.map((value) =>
          value > 140 ? 'red' : value < 70 ? 'blue' : 'green'
        ),
        tension: 0.3,
        fill: false,
        pointRadius: 5,
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
            return `Avg Glucose: ${context.parsed.y} mg/dL`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: trendType === 'weekly' ? 'Week Starting' : 'Month',
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
    <div className="mt-10">
      <div className="mb-4">
        <label className="block font-semibold mb-1">View Type:</label>
        <select
          className="input"
          value={trendType}
          onChange={(e) => setTrendType(e.target.value)}
        >
          <option value="weekly">Weekly Trends</option>
          <option value="monthly">Monthly Trends</option>
        </select>
      </div>

      {labels.length === 0 ? (
        <p className="text-gray-500">No data to display trends.</p>
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
};

export default ChartTrends;
