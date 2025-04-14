import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.id) {
      throw new Error('Invalid token');
    }
    // Optional: you could store the payload in context here if needed
    return children;
  } catch (err) {
    console.error('[ProtectedRoute] Invalid or malformed token. Logging out.', err);
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
