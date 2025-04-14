import React, { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const LogTableView = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const formatDate = (str) => {
    const date = new Date(str);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Matches <input type="date">
  };
  


  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.food?.toLowerCase().includes(search.toLowerCase()) ||
        log.activity?.toLowerCase().includes(search.toLowerCase()) ||
        log.notes?.toLowerCase().includes(search.toLowerCase());

      const matchesMood = moodFilter ? log.mood === moodFilter : true;
      const matchesTime = timeFilter ? log.mealType === timeFilter : true;
      const matchesDate = dateFilter
  ? formatDate(log.timestamp) === new Date(dateFilter).toLocaleDateString('en-GB')
  : true;


      return matchesSearch && matchesMood && matchesTime && matchesDate;
    });
  }, [logs, search, moodFilter, timeFilter, dateFilter]);

  const exportCSV = () => {
    const headers = ['Date', 'Time of Day', 'Glucose', 'Food', 'Activity', 'Mood', 'Medication', 'Notes'];
    const rows = filteredLogs.map((log) => [
        new Date(log.timestamp).toLocaleDateString('en-GB')
        ,
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
    link.setAttribute('download', 'gdm_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const headers = [['Date', 'Time', 'Glucose', 'Food', 'Activity', 'Mood', 'Medication', 'Notes']];
    const data = filteredLogs.map((log) => [
    new Date(log.timestamp).toLocaleDateString('en-GB'),
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
      body: data,
    });

    doc.save('gdm_logs.pdf');
  };

  return (
    <div className="mt-section">
      <h2 className="heading">📋 Log Table View</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="input"
        />
        <select value={moodFilter} onChange={(e) => setMoodFilter(e.target.value)} className="input">
          <option value="">All Moods</option>
          <option value="Happy">🙂 Happy</option>
          <option value="Neutral">😐 Neutral</option>
          <option value="Tired">😴 Tired</option>
          <option value="Stressed">😣 Stressed</option>
          <option value="Sad">😔 Sad</option>
        </select>
        <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="input">
          <option value="">All Times</option>
          <option value="Before Breakfast">Before Breakfast</option>
          <option value="After Breakfast">After Breakfast</option>
          <option value="After Lunch">After Lunch</option>
          <option value="After Dinner">After Dinner</option>
        </select>
        <input
          type="text"
          placeholder="Search food/activity/notes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-outline">⬇️ CSV</button>
          <button onClick={exportPDF} className="btn-outline">🧾 PDF</button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto mt-4">
        {filteredLogs.length === 0 ? (
          <p className="text-gray-500">No logs match your filters.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Glucose</th>
                <th className="p-2 border">Food</th>
                <th className="p-2 border">Activity</th>
                <th className="p-2 border">Mood</th>
                <th className="p-2 border">Medication</th>
                <th className="p-2 border">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log._id}>
                  <td className="p-2 border">{new Date(log.timestamp).toLocaleDateString('en-GB')}</td>
                  <td className="p-2 border">{log.mealType}</td>
                  <td className="p-2 border">{log.glucoseLevel}</td>
                  <td className="p-2 border">{log.food}</td>
                  <td className="p-2 border">{log.activity}</td>
                  <td className="p-2 border">{log.mood}</td>
                  <td className="p-2 border">{log.medication}</td>
                  <td className="p-2 border">{log.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LogTableView;
