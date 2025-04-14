// src/components/Layout.jsx
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition duration-300">
      <main className="max-w-5xl mx-auto p-4">{children}</main>
    </div>
  );
};


export default Layout;
