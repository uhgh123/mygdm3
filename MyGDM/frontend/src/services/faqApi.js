import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/faqs';
const getToken = () => localStorage.getItem('token');

export const fetchFaqs = async (category = '') => {
  const res = await axios.get(`${BASE_URL}?category=${category}`);
  return res.data;
};

export const createFaq = async (faqData) => {
  const res = await axios.post(BASE_URL, faqData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

export const updateFaq = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

export const deleteFaq = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};
