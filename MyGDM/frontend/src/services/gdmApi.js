import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');

export const getLogs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/logs`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
};

export const createLog = async (logData) => {
  try {
    const response = await axios.post(`${BASE_URL}/logs`, logData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating log:', error);
    throw error;
  }
};

export const updateLog = async (id, data) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${BASE_URL}/logs/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteLog = async (id) => {
  const token = localStorage.getItem('token');
  await axios.delete(`${BASE_URL}/logs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
