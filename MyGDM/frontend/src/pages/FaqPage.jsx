import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const FAQPage = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/faqs');
        setFaqs(res.data);
      } catch (err) {
        console.error('Error fetching FAQs', err);
      }
    };
    fetchFaqs();
  }, []);

  const categories = [...new Set(faqs.map(f => f.category))];

  const filteredFaqs = faqs
    .filter(f =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
    )
    .filter(f => !selectedCategory || f.category === selectedCategory);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">📚 FAQs</h1>
          <button
            onClick={() => navigate('/about/information')}
            className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded shadow"
          >
            Go to Information
          </button>
        </div>

        {selectedCategory && (
          <div className="flex items-center mb-6">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="ml-2 px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {!selectedCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setExpandedId(null);
                  setSearch('');
                }}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold p-6 rounded-lg shadow transition-all text-left"
              >
                <span className="text-xl block">{cat}</span>
              </button>
            ))}
          </div>
        )}

        {selectedCategory && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedCategory}</h2>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setExpandedId(null);
                  setSearch('');
                }}
                className="text-blue-600 text-sm underline"
              >
                ← Back to Categories
              </button>
            </div>

            <ul className="space-y-4">
              {filteredFaqs.length === 0 && (
                <li className="text-gray-500">No matching FAQs found.</li>
              )}
              {filteredFaqs.map((faq) => (
                <li key={faq._id} className="border rounded p-3">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === faq._id ? null : faq._id)
                    }
                    className="w-full text-left font-medium text-lg flex justify-between items-center"
                  >
                    {faq.question}
                    <span>{expandedId === faq._id ? '▲' : '▼'}</span>
                  </button>
                  {expandedId === faq._id && (
                    <div className="mt-2 text-gray-700">{faq.answer}</div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Layout>
  );
};

export default FAQPage;
