import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../services/forumApi';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const ForumHome = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    load();
  }, []);

  return (
    <Layout>
      <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 Forum Categories</h2>
      <ul className="space-y-4">
        {categories.map((cat) => (
          <li key={cat._id} className="border p-4 rounded shadow">
            <Link to={`/forum/category/${cat._id}`} className="text-blue-600 text-lg font-semibold">
              {cat.name}
            </Link>
            <p className="text-sm text-gray-600">{cat.description}</p>
          </li>
        ))}
      </ul>
    </div>
    </Layout>
  );
};

export default ForumHome;
