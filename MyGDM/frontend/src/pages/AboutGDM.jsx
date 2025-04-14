import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const AboutGDM = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">About Gestational Diabetes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <button
            className="p-8 bg-blue-200 rounded-lg shadow hover:bg-blue-300 transition"
            onClick={() => navigate('/about/information')}
          >
            <h2 className="text-2xl font-semibold text-center">Information About GDM</h2>
          </button>
          <button
            className="p-8 bg-green-200 rounded-lg shadow hover:bg-green-300 transition"
            onClick={() => navigate('/about/faq')}
          >
            <h2 className="text-2xl font-semibold text-center">FAQ</h2>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AboutGDM;
