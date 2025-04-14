import React from 'react';

const MonthlyInsights = ({ monthlyStats }) => (
  <div className="mt-section">
    <h2 className="heading">📆 Monthly Averages</h2>
    <ul className="space-y-2">
      {monthlyStats.map((m) => (
        <li key={m.month} className="card">
          <p><strong>Month:</strong> {m.month}</p>
          <p><strong>Average Glucose:</strong> {m.average} mg/dL</p>
        </li>
      ))}
    </ul>
  </div>
);

export default MonthlyInsights;
