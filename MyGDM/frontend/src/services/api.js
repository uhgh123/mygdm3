import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const getLogs = async () => {
  try {
    const token = localStorage.getItem('token'); // assuming you stored it after login
    const response = await axios.get(`${BASE_URL}/logs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
};
