import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const InformationPage = () => {
  const [infoEntries, setInfoEntries] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/information');
        setInfoEntries(res.data);
      } catch (error) {
        console.error('Error fetching information', error);
      }
    };
    fetchInformation();
  }, []);

  const groups = [...new Set(infoEntries.map(entry => entry.group))];
  const entriesByGroup = group => infoEntries.filter(entry => entry.group === group);
  const categoriesInGroup = group => {
    const entries = entriesByGroup(group);
    return [...new Set(entries.map(entry => entry.category))];
  };
  const getInformation = (group, category) => {
    return infoEntries.find(entry => entry.group === group && entry.category === category);
  };

  const renderGroupCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {groups.map((grp, idx) => (
        <div
          key={idx}
          onClick={() => {
            setSelectedGroup(grp);
            setSelectedCategory(null);
          }}
          className="cursor-pointer bg-green-100 hover:bg-green-200 text-green-800 font-semibold p-6 rounded-lg shadow transition-all"
        >
          {grp}
        </div>
      ))}
    </div>
  );

  const renderCategoryCards = () => {
    const entries = entriesByGroup(selectedGroup);
    const categories = [...new Set(entries.map(e => e.category))];

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{selectedGroup}</h2>
          <button
            onClick={() => {
              setSelectedGroup(null);
              setSelectedCategory(null);
              setSearch('');
            }}
            className="text-green-600 text-sm underline"
          >
            ← Back to Groups
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedCategory(cat);
                setSearch('');
              }}
              className="cursor-pointer bg-green-50 hover:bg-green-100 text-green-800 font-semibold p-4 rounded-lg shadow transition-all"
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInformationDetail = () => {
    const info = getInformation(selectedGroup, selectedCategory);
    if (!info) return <div>No information available.</div>;

    const filteredSections = info.sections.filter(section => {
      const inHeading = section.heading.toLowerCase().includes(search.toLowerCase());
      const inContent = section.content.some(line =>
        line.toLowerCase().includes(search.toLowerCase())
      );
      return inHeading || inContent;
    });

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{info.title}</h2>
          <div>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearch('');
              }}
              className="text-green-600 text-sm underline mr-4"
            >
              ← Back to Categories
            </button>
            <button
              onClick={() => {
                setSelectedGroup(null);
                setSelectedCategory(null);
                setSearch('');
              }}
              className="text-green-600 text-sm underline"
            >
              ← Back to Groups
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search this section..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-4 py-2 rounded pr-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2 text-gray-500 hover:text-black"
            >
              ❌
            </button>
          )}
        </div>

        {filteredSections.map((section, index) => (
          <div key={index} className="mb-6 border p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">{section.heading}</h3>
            <ul className="list-disc pl-5">
              {section.content.map((item, i) => (
                <li key={i} className="mb-1">{item}</li>
              ))}
            </ul>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <p className="text-gray-500">No matching content found.</p>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">📖 Information</h1>
          <button
            onClick={() => navigate('/about/faq')}
            className="text-sm bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded shadow"
          >
            Go to FAQ
          </button>
        </div>

        {!selectedGroup && renderGroupCards()}
        {selectedGroup && !selectedCategory && renderCategoryCards()}
        {selectedGroup && selectedCategory && renderInformationDetail()}
      </div>
    </Layout>
  );
};

export default InformationPage;
