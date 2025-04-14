import React, { useState } from 'react';
import { createLog } from '../services/gdmApi';

const GdmLogForm = ({ onNewLog, selectedDate }) => {
  const [formData, setFormData] = useState({
    glucoseLevel: '',
    mealType: '',
    food: '',
    activity: '',
    mood: '',
    medication: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get the current time (now)
      const now = new Date();
      const selected = new Date(selectedDate);

      // Combine selected date with current time
      const combinedTimestamp = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );

      const dataToSend = {
        ...formData,
        timestamp: combinedTimestamp.toISOString()
      };

      const newLog = await createLog(dataToSend);
      onNewLog(newLog);

      setFormData({
        glucoseLevel: '',
        mealType: '',
        food: '',
        activity: '',
        mood: '',
        medication: '',
        notes: '',
      });
    } catch (err) {
      alert('Error submitting log');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
      <h2 className="text-xl font-semibold">➕ Add New GDM Log</h2>

      <input
        type="number"
        name="glucoseLevel"
        placeholder="Glucose Level (mg/dL)"
        value={formData.glucoseLevel}
        onChange={handleChange}
        className="input"
        required
      />

      <select
        name="mealType"
        value={formData.mealType}
        onChange={handleChange}
        className="input"
        required
      >
        <option value="">Select Time of Day</option>
        <option value="Before Breakfast">Before Breakfast</option>
        <option value="After Breakfast">After Breakfast</option>
        <option value="After Lunch">After Lunch</option>
        <option value="After Dinner">After Dinner</option>
      </select>

      <input
        type="text"
        name="food"
        placeholder="Food (optional)"
        value={formData.food}
        onChange={handleChange}
        className="input"
      />

      <input
        type="text"
        name="activity"
        placeholder="Activity (optional)"
        value={formData.activity}
        onChange={handleChange}
        className="input"
      />

      <select
        name="mood"
        value={formData.mood}
        onChange={handleChange}
        className="input"
      >
        <option value="">Mood (optional)</option>
        <option value="Happy">🙂 Happy</option>
        <option value="Neutral">😐 Neutral</option>
        <option value="Tired">😴 Tired</option>
        <option value="Stressed">😣 Stressed</option>
        <option value="Sad">😔 Sad</option>
      </select>

      <input
        type="text"
        name="medication"
        placeholder="Medication (e.g. Metformin)"
        value={formData.medication}
        onChange={handleChange}
        className="input"
      />

      <textarea
        name="notes"
        placeholder="Comments / Notes"
        value={formData.notes}
        onChange={handleChange}
        className="input"
      />

      <button
        type="submit"
        className="btn"
      >
        Submit Log
      </button>
    </form>
  );
};

export default GdmLogForm;
