import React, { useEffect, useState } from 'react';
import { getReminders, deleteReminder } from '../services/reminderApi';
import toast from 'react-hot-toast';

const ReminderList = () => {
  const [reminders, setReminders] = useState([]);

  const fetchReminders = async () => {
    const data = await getReminders();
    setReminders(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this reminder?')) {
      await deleteReminder(id);
      toast.success('🗑 Reminder deleted');
      fetchReminders();
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">📋 Your Reminders</h3>
      {reminders.length === 0 ? (
        <p className="text-gray-500">No reminders yet.</p>
      ) : (
        <ul className="space-y-2">
          {reminders.map((reminder) => (
            <li key={reminder._id} className="card flex justify-between items-center">
              <div>
                <p className="font-medium">{reminder.label || 'No label'}</p>
                <p className="text-sm text-gray-600">
                  {new Date(reminder.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button onClick={() => handleDelete(reminder._id)} className="btn-outline text-sm">
                🗑 Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReminderList;
