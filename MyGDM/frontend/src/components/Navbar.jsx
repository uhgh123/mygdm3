import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow relative z-50">
      <div className="text-xl font-bold">MyGDM</div>
      <div className="flex gap-4 items-center relative">
        {token ? (
          <>
            <ThemeToggle />
            <Link to="/" className="text-blue-600 hover:text-gray-300">Dashboard</Link>
            <Link to="/reminders" className="text-blue-600 hover:text-gray-300">Reminders</Link>
            <Link to="/forum" className="text-blue-600 hover:text-gray-300">Forum</Link>
            <Link to="/recipes" className="btn w-full text-left">🍽️ Recipes</Link>
            <Link to="/settings" className="text-blue-600 hover:text-gray-300">⚙️ Settings</Link>

            {/* Dropdown with static clickable About GDM + hover menu */}
            <div className="relative group">
              <Link to="/about" className="mr-2 text-blue-600 hover:text-blue-800 font-medium">
                About GDM
              </Link>
              <div className="absolute hidden group-hover:block bg-white shadow rounded mt-1 w-48">
                <Link
                  to="/about/information"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  GDM Information
                </Link>
                <Link
                  to="/about/faq"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  FAQ
                </Link>
              </div>
            </div>

            <Link to="/faq" className="btn w-full text-left">❓ FAQs</Link>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600">Login</Link>
            <Link to="/register" className="text-blue-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
