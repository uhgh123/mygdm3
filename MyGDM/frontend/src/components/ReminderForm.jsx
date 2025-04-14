import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createReminder } from '../services/reminderApi';

const ReminderForm = () => {
  const [label, setLabel] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createReminder({ label, time });
    if (success) {
      toast.success('✅ Reminder added!');
      setLabel('');
      setTime('');
    } else {
      toast.error('❌ Failed to add reminder');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 max-w-lg">
      <h3 className="text-lg font-bold mb-2">➕ Add Reminder</h3>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Label (e.g., Lunch)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="input"
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="btn">Save</button>
      </div>
    </form>
  );
};

export default ReminderForm;
