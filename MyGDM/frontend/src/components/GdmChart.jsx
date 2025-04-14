import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const GdmChart = ({ logs }) => {
  // Group logs by date and average glucose levels
  const grouped = {};

  logs.forEach((log) => {
    const dateKey = new Date(log.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
    if (!grouped[dateKey]) {
      grouped[dateKey] = { total: 0, count: 0 };
    }
    grouped[dateKey].total += log.glucoseLevel;
    grouped[dateKey].count += 1;
  });

  const chartData = Object.entries(grouped).map(([date, { total, count }]) => ({
    date,
    avgGlucose: parseFloat((total / count).toFixed(1)),
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-4">📆 Avg Glucose per Day</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="avgGlucose" stroke="#16a34a" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GdmChart;
