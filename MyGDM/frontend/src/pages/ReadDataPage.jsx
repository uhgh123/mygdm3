import React, { useEffect, useState, useMemo } from 'react';
import { getLogs } from '../services/gdmApi';
import Layout from '../components/Layout';
import { groupBy } from 'lodash';
import ChartByEntry from '../components/ChartByEntry';
import ChartByDay from '../components/ChartByDay';
import ChartTrends from '../components/ChartTrends';
import WeeklyInsights from '../components/WeeklyInsights';
import MonthlyInsights from '../components/MonthlyInsights';
import SmartSuggestions from '../components/SmartSuggestions';
import DailyLogView from '../components/DailyLogView';

const ReadDataPage = () => {
  const [logs, setLogs] = useState([]);
  const [chartType, setChartType] = useState('entry');
  const [mealFilter, setMealFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilters, setTimeFilters] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await getLogs();
      setLogs(data);
    };
    fetchLogs();
  }, []);

  const formatInputDate = (dateStr) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // matches input type="date"
  };

  const isSameDate = (logDate, selectedDate) =>
    formatInputDate(logDate) === formatInputDate(selectedDate);

  const handleTimeFilterChange = (e) => {
    const value = e.target.value;
    setTimeFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const filteredLogs = logs.filter((log) => {
    const mealMatch = !mealFilter || log.mealType === mealFilter;
    const dateMatch = !dateFilter || isSameDate(log.timestamp, dateFilter);
    const timeMatch = timeFilters.length === 0 || timeFilters.includes(log.mealType);
    return mealMatch && dateMatch && timeMatch;
  });

  const weeklyStats = useMemo(() => {
    const groupByWeek = {};

    logs.forEach((log) => {
      const date = new Date(log.timestamp);
      const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const startOfWeek = new Date(local);
      startOfWeek.setDate(local.getDate() - local.getDay());
      const key = startOfWeek.toLocaleDateString('en-GB');

      if (!groupByWeek[key]) groupByWeek[key] = [];
      groupByWeek[key].push(Number(log.glucoseLevel));
    });

    return Object.entries(groupByWeek).map(([week, entries]) => {
      const avg = entries.reduce((a, b) => a + b, 0) / entries.length;
      return { week, average: avg.toFixed(1) };
    });
  }, [logs]);

  const monthlyStats = useMemo(() => {
    const groupByMonth = {};

    logs.forEach((log) => {
      const d = new Date(log.timestamp);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      if (!groupByMonth[key]) groupByMonth[key] = [];
      groupByMonth[key].push(Number(log.glucoseLevel));
    });

    return Object.entries(groupByMonth).map(([month, entries]) => {
      const avg = entries.reduce((a, b) => a + b, 0) / entries.length;
      return { month, average: avg.toFixed(1) };
    });
  }, [logs]);

  return (
    <Layout>
      <div className="p-section">
        <h1 className="heading">📈 Read GDM Data</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div>
            <label className="block font-semibold mb-1">Filter by Time of Day:</label>
            <select
              value={mealFilter}
              onChange={(e) => setMealFilter(e.target.value)}
              className="input"
            >
              <option value="">All</option>
              <option value="Before Breakfast">Before Breakfast</option>
              <option value="After Breakfast">After Breakfast</option>
              <option value="After Lunch">After Lunch</option>
              <option value="After Dinner">After Dinner</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Filter by Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Chart View:</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="input"
            >
              <option value="entry">Per Log Entry</option>
              <option value="day">Average Per Day</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1">Graph Time Filters:</label>
          <div className="flex flex-wrap gap-2">
            {['Before Breakfast', 'After Breakfast', 'After Lunch', 'After Dinner'].map((time) => (
              <label key={time} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={time}
                  checked={timeFilters.includes(time)}
                  onChange={handleTimeFilterChange}
                />
                {time}
              </label>
            ))}
          </div>
        </div>

        <SmartSuggestions logs={filteredLogs} />

        <div className="mt-6">
          {chartType === 'entry' ? (
            <ChartByEntry logs={filteredLogs} />
          ) : (
            <ChartByDay logs={filteredLogs} />
          )}
        </div>

        <WeeklyInsights weeklyStats={weeklyStats} />
        <MonthlyInsights monthlyStats={monthlyStats} />
        <ChartTrends logs={filteredLogs} />

        <DailyLogView
          logs={filteredLogs}
          onLogUpdated={(updatedLog) => {
            if (updatedLog.deleted) {
              setLogs((prev) => prev.filter((log) => log._id !== updatedLog._id));
            } else {
              setLogs((prev) =>
                prev.map((log) => (log._id === updatedLog._id ? updatedLog : log))
              );
            }
          }}
        />
      </div>
    </Layout>
  );
};

export default ReadDataPage;
