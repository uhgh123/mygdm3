import React, { useState } from 'react';
import { updateLog, deleteLog } from '../services/gdmApi';

const getAnomaly = (glucose) => {
  if (glucose > 140) return 'High';
  if (glucose < 70) return 'Low';
  return 'Normal';
};

const DailyLogView = ({ logs, onLogUpdated }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [editingLogId, setEditingLogId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [moodFilter, setMoodFilter] = useState('');
  const [mealFilter, setMealFilter] = useState('');
  const [medFilter, setMedFilter] = useState('');

  // ✅ Use UK local time format for comparing against selected date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // matches input type="date"
  };

  const filteredLogs = logs.filter((log) => {
    const isSameDay = selectedDate
      ? formatDate(log.timestamp) === selectedDate
      : true;
    const moodMatch = moodFilter ? log.mood === moodFilter : true;
    const mealMatch = mealFilter ? log.mealType === mealFilter : true;
    const medMatch = medFilter ? log.medication?.toLowerCase().includes(medFilter.toLowerCase()) : true;

    return isSameDay && moodMatch && mealMatch && medMatch;
  });

  const handleEditClick = (log) => {
    setEditingLogId(log._id);
    setEditFormData({
      glucoseLevel: log.glucoseLevel,
      mealType: log.mealType,
      food: log.food || '',
      activity: log.activity || '',
      mood: log.mood || '',
      medication: log.medication || '',
      notes: log.notes || '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id) => {
    try {
      const updated = await updateLog(id, editFormData);
      onLogUpdated(updated);
      setEditingLogId(null);
    } catch (err) {
      alert('Error updating log');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this log?');
    if (!confirmed) return;

    try {
      await deleteLog(id);
      onLogUpdated({ _id: id, deleted: true });
    } catch (err) {
      alert('Error deleting log');
      console.error(err);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="heading mb-4">📅 Daily Log Viewer</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
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
        <select value={mealFilter} onChange={(e) => setMealFilter(e.target.value)} className="input">
          <option value="">All Times</option>
          <option value="Before Breakfast">Before Breakfast</option>
          <option value="After Breakfast">After Breakfast</option>
          <option value="After Lunch">After Lunch</option>
          <option value="After Dinner">After Dinner</option>
        </select>
        <input
          type="text"
          value={medFilter}
          onChange={(e) => setMedFilter(e.target.value)}
          placeholder="Filter Medication"
          className="input"
        />
      </div>

      {selectedDate && filteredLogs.length === 0 && (
        <p className="text-gray-500">No logs found for selected filters.</p>
      )}

      {filteredLogs.length > 0 && (
        <ul className="space-y-4">
          {filteredLogs.map((log) => {
            const anomaly = getAnomaly(log.glucoseLevel);
            const isEditing = editingLogId === log._id;

            return (
              <li key={log._id} className="card">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      name="glucoseLevel"
                      placeholder="Glucose"
                      value={editFormData.glucoseLevel}
                      onChange={handleChange}
                      className="input"
                    />
                    <select
                      name="mealType"
                      value={editFormData.mealType}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Time of Day</option>
                      <option value="Before Breakfast">Before Breakfast</option>
                      <option value="After Breakfast">After Breakfast</option>
                      <option value="After Lunch">After Lunch</option>
                      <option value="After Dinner">After Dinner</option>
                    </select>
                    <input
                      type="text"
                      name="food"
                      placeholder="Food"
                      value={editFormData.food}
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      type="text"
                      name="activity"
                      placeholder="Activity"
                      value={editFormData.activity}
                      onChange={handleChange}
                      className="input"
                    />
                    <select
                      name="mood"
                      value={editFormData.mood}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Mood</option>
                      <option value="Happy">🙂 Happy</option>
                      <option value="Neutral">😐 Neutral</option>
                      <option value="Tired">😴 Tired</option>
                      <option value="Stressed">😣 Stressed</option>
                      <option value="Sad">😔 Sad</option>
                    </select>
                    <input
                      type="text"
                      name="medication"
                      placeholder="Medication"
                      value={editFormData.medication}
                      onChange={handleChange}
                      className="input"
                    />
                    <textarea
                      name="notes"
                      placeholder="Notes"
                      value={editFormData.notes}
                      onChange={handleChange}
                      className="input"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(log._id)}
                        className="btn"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingLogId(null)}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>
                      <strong>Glucose:</strong> {log.glucoseLevel} mg/dL{' '}
                      {anomaly === 'High' && <span className="text-red-600 ml-2">🚨 High</span>}
                      {anomaly === 'Low' && <span className="text-blue-600 ml-2">🔵 Low</span>}
                      {anomaly === 'Normal' && <span className="text-green-600 ml-2">✅ Normal</span>}
                    </p>
                    <p><strong>Time of Day:</strong> {log.mealType || 'N/A'}</p>
                    <p><strong>Food:</strong> {log.food?.trim() ? log.food : 'N/A'}</p>
                    <p><strong>Activity:</strong> {log.activity?.trim() ? log.activity : 'N/A'}</p>
                    <p><strong>Mood:</strong> {log.mood?.trim() ? log.mood : 'N/A'}</p>
                    <p><strong>Medication:</strong> {log.medication?.trim() ? log.medication : 'N/A'}</p>
                    <p><strong>Notes:</strong> {log.notes?.trim() ? log.notes : 'N/A'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleDateString('en-GB')} at{' '}
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>

                    <div className="flex gap-3 mt-2">
                      <button onClick={() => handleEditClick(log)} className="btn-outline">✏️ Edit</button>
                      <button onClick={() => handleDelete(log._id)} className="btn-outline text-red-600">🗑️ Delete</button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DailyLogView;
