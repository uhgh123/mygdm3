import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const BASE_URL = 'http://localhost:5000/api';

const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [label, setLabel] = useState('');
  const [time, setTime] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/reminders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(res.data);
    } catch (err) {
      console.error('Error fetching reminders:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (editingId) {
        const res = await axios.put(`${BASE_URL}/reminders/${editingId}`, { label, time }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReminders((prev) =>
          prev.map((r) => (r._id === editingId ? res.data : r))
        );
      } else {
        const res = await axios.post(`${BASE_URL}/reminders`, { label, time }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReminders((prev) => [...prev, res.data]);
      }

      setLabel('');
      setTime('');
      setEditingId(null);
    } catch (err) {
      console.error('Error saving reminder:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Error deleting reminder:', err);
    }
  };

  const handleEdit = (reminder) => {
    setLabel(reminder.label);
    setTime(reminder.time);
    setEditingId(reminder._id);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <Layout>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">⏰ Reminders</h1>

      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2 max-w-md">
        <input
          type="text"
          placeholder="Label (e.g., Lunch)"
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'Update Reminder' : 'Add Reminder'}
        </button>
      </form>

      <ul className="space-y-2">
        {reminders.map((reminder) => (
          <li key={reminder._id} className="border p-3 rounded shadow">
            <p><strong>Label:</strong> {reminder.label}</p>
            <p><strong>Time:</strong> {reminder.time}</p>

            <div className="flex gap-2 mt-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => handleEdit(reminder)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(reminder._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </Layout>
  );
};

export default RemindersPage;
