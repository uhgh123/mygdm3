import React, { useEffect, useState } from 'react';
import { getReminders, createReminder, deleteReminder } from '../services/reminderApi';

const ReminderPanel = ({ showList = true }) => {

  const [reminders, setReminders] = useState([]);
  const [label, setLabel] = useState('');
  const [time, setTime] = useState('');

  const loadReminders = async () => {
    const data = await getReminders();
    setReminders(data);
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReminder = await createReminder({ label, time });
    if (newReminder) {
      setReminders((prev) => [...prev, newReminder]);
      setLabel('');
      setTime('');
    }
  };

  const handleDelete = async (id) => {
    await deleteReminder(id);
    setReminders((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="my-6 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">🔔 Reminders</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Reminder label (e.g. Lunch)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="border p-2"
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">Add Reminder</button>
      </form>

      <ul className="space-y-2">
        {reminders.map((r) => (
          <li key={r._id} className="flex justify-between items-center border p-2 rounded">
            <span>{r.label} — {r.time}</span>
            <button onClick={() => handleDelete(r._id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReminderPanel;
