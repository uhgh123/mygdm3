import React from 'react';

const WeeklyInsights = ({ weeklyStats }) => (
  <div className="mt-section">
    <h2 className="heading">📅 Weekly Averages</h2>
    <ul className="space-y-2">
      {weeklyStats.map((w) => (
        <li key={w.week} className="card">
          <p><strong>Week starting:</strong> {w.week}</p>
          <p><strong>Average Glucose:</strong> {w.average} mg/dL</p>
        </li>
      ))}
    </ul>
  </div>
);

export default WeeklyInsights;
