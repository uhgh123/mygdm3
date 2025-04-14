import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExportInsights = ({ logs }) => {
  const [month, setMonth] = useState('');
  const [weekStart, setWeekStart] = useState('');

  const formatDisplayDate = (d) =>
    new Date(d).toLocaleDateString('en-GB');

  const formatDateOnly = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // Midnight local
  };

  const getLogsInMonth = () => {
    if (!month) return [];

    return logs.filter((log) => {
      const d = new Date(log.timestamp);
      const logMonth = d.getMonth() + 1;
      const logYear = d.getFullYear();

      const [inputYear, inputMonth] = month.split('-');
      return (
        logMonth === Number(inputMonth) &&
        logYear === Number(inputYear)
      );
    });
  };

  const getLogsInWeek = () => {
    if (!weekStart) return [];

    const start = formatDateOnly(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return logs.filter((log) => {
      const logDate = formatDateOnly(log.timestamp);
      return logDate >= start && logDate <= end;
    });
  };

  const exportCSV = (data, label) => {
    const headers = ['Date', 'Time', 'Glucose', 'Food', 'Activity', 'Mood', 'Medication', 'Notes'];
    const rows = data.map((log) => [
      formatDisplayDate(log.timestamp),
      log.mealType,
      log.glucoseLevel,
      log.food || '',
      log.activity || '',
      log.mood || '',
      log.medication || '',
      log.notes || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${label}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = (data, label) => {
    const doc = new jsPDF();
    const headers = [['Date', 'Time', 'Glucose', 'Food', 'Activity', 'Mood', 'Medication', 'Notes']];
    const body = data.map((log) => [
      formatDisplayDate(log.timestamp),
      log.mealType,
      log.glucoseLevel,
      log.food || '',
      log.activity || '',
      log.mood || '',
      log.medication || '',
      log.notes || '',
    ]);

    autoTable(doc, {
      head: headers,
      body: body,
    });

    doc.save(`${label}_export.pdf`);
  };

  return (
    <div className="mt-section">
      <h2 className="heading">📤 Export Logs by Week / Month</h2>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {/* Month Selector */}
        <div>
          <label className="block mb-1 font-medium">Month:</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="input"
          />
          <div className="flex gap-2 mt-2">
            <button
              className="btn-outline"
              onClick={() => exportCSV(getLogsInMonth(), 'monthly')}
              disabled={!month}
            >
              ⬇️ CSV
            </button>
            <button
              className="btn-outline"
              onClick={() => exportPDF(getLogsInMonth(), 'monthly')}
              disabled={!month}
            >
              🧾 PDF
            </button>
          </div>
        </div>

        {/* Week Selector */}
        <div>
          <label className="block mb-1 font-medium">Week Start (Mon):</label>
          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="input"
          />
          <div className="flex gap-2 mt-2">
            <button
              className="btn-outline"
              onClick={() => exportCSV(getLogsInWeek(), 'weekly')}
              disabled={!weekStart}
            >
              ⬇️ CSV
            </button>
            <button
              className="btn-outline"
              onClick={() => exportPDF(getLogsInWeek(), 'weekly')}
              disabled={!weekStart}
            >
              🧾 PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportInsights;
