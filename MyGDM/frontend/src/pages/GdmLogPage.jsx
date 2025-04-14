import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { getLogs } from '../services/gdmApi';
import { getReminders } from '../services/reminderApi';
import toast from 'react-hot-toast';

import GdmLogForm from '../components/GdmLogForm';
import DailyLogView from '../components/DailyLogView';
import ReminderPanel from '../components/ReminderPanel';

const GdmLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });

  const fetchLogs = async () => {
    const data = await getLogs();
    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();

    const interval = setInterval(async () => {
      const reminders = await getReminders();
      const now = new Date();
      const key = `${now.getHours()}:${now.getMinutes()}`;

      reminders.forEach((reminder) => {
        const rTime = new Date(reminder.time);
        const reminderKey = `${rTime.getHours()}:${rTime.getMinutes()}`;
        const toastKey = `reminder-${reminder._id}-${reminderKey}`;

        if (key === reminderKey && !localStorage.getItem(toastKey)) {
          toast.success(`🔔 Reminder: ${reminder.label || 'Check your glucose log'}`);
          localStorage.setItem(toastKey, 'shown');
          setTimeout(() => localStorage.removeItem(toastKey), 60000);
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleNewLog = (log) => {
    setLogs((prev) => [log, ...prev]);
  };

  const isSameLocalDate = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const filteredLogs = logs.filter((log) =>
    isSameLocalDate(log.timestamp, selectedDate)
  );

  return (
    <Layout>
      <div className="p-section">
        <h1 className="heading">📝 Log GDM Data</h1>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Log for Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input"
          />
        </div>

        <GdmLogForm onNewLog={handleNewLog} selectedDate={selectedDate} />

        <ReminderPanel showList={false} />
        <div className="mt-2">
          <a href="/reminders" className="link text-sm text-blue-600">
            🔗 View All Reminders
          </a>
        </div>

        <DailyLogView
          logs={logs}
          selectedDate={selectedDate}
          onLogUpdated={(updatedLog) => {
            if (updatedLog.deleted) {
              setLogs((prev) => prev.filter((log) => log._id !== updatedLog._id));
            } else {
              setLogs((prev) =>
                prev.map((log) =>
                  log._id === updatedLog._id ? updatedLog : log
                )
              );
            }
          }}
        />
      </div>
    </Layout>
  );
};

export default GdmLogPage;
