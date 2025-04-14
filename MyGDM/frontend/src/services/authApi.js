import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/login`, userData);
  const { token } = response.data;
  localStorage.setItem('token', token);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};
