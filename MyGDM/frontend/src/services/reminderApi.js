import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/reminders';
const getToken = () => localStorage.getItem('token');

export const getReminders = async () => {
  try {
    const res = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching reminders:', err);
    return [];
  }
};

export const createReminder = async (reminderData) => {
  try {
    const res = await axios.post(BASE_URL, reminderData, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return res.data;
  } catch (err) {
    console.error('Error creating reminder:', err);
    return null;
  }
};

export const updateReminder = async (id, updatedData) => {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return res.data;
    } catch (err) {
      console.error('Error updating reminder:', err);
      return null;
    }
  };
  
export const deleteReminder = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (err) {
    console.error('Error deleting reminder:', err);
  }
};
