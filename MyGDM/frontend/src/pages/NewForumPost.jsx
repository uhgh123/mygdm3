import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost } from '../services/forumApi';
import Layout from '../components/Layout';

const NewForumPost = () => {
  const { id } = useParams(); // category ID
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ title, body, categoryId: id });
      navigate(`/forum/category/${id}`);
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <Layout>
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🖊️ Create a Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <textarea
          placeholder="Post Content"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border p-2 w-full h-32"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Post
        </button>
      </form>
    </div>
    </Layout>
  );
};

export default NewForumPost;
