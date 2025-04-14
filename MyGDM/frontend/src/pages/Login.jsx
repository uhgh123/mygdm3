import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';

const BASE_URL = 'http://localhost:5000/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('[Login] Attempting login with', email);
      const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      const { token } = res.data;
      console.log('[Login] Received token:', token);
  
      localStorage.setItem('token', token);
  
      // Navigate AFTER storing the token
      navigate('/');
    } catch (err) {
      console.error('[Login] Error during login:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  

  return (
    <Layout>
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
    </Layout>
  );
};

export default Login;

