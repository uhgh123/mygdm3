import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setMessage('Registered successfully!');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error);
      setMessage('Registration failed.');
    }
  };

  return (
    <Layout>
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
    </Layout>
  );
};

export default Register;
