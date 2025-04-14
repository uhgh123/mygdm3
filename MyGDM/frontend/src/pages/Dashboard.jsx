import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Log GDM Data',
      description: 'Record your glucose levels, food, activity, mood, medication, and more.',
      icon: '📝',
      onClick: () => navigate('/log'),
    },
    {
      title: 'Read GDM Data',
      description: 'View insights, trends, daily logs, and summaries.',
      icon: '📊',
      onClick: () => navigate('/read'),
    },
    {
      title: 'Export GDM Data',
      description: 'Download your data in CSV or PDF formats for reporting.',
      icon: '📤',
      onClick: () => navigate('/export'),
    },
    {
      title: 'Reminders',
      description: 'Manage glucose check reminders to stay on track.',
      icon: '⏰',
      onClick: () => navigate('/reminders'),
    },
  ];

  return (
    <Layout>
      <div className="p-section">
        <h1 className="heading">📋 Dashboard</h1>
        <p className="text-gray-600 mb-6">Choose what you want to do today:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="card cursor-pointer hover:shadow-lg transition"
              onClick={card.onClick}
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>{card.icon}</span> {card.title}
              </h2>
              <p className="text-sm mt-2 text-gray-700">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
