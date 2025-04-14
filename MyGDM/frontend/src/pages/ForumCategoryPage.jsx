import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchPostsByCategory,
  togglePostLike,
  togglePostPin
} from '../services/forumApi';
import Layout from '../components/Layout';

const ForumCategoryPage = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }

    const loadPosts = async () => {
      const data = await fetchPostsByCategory(id);
      setPosts(data);
    };

    loadPosts();
  }, [id]);

  const handleLike = async (postId) => {
    try {
      const { liked, likesCount } = await togglePostLike(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, likes: Array(likesCount).fill(null) } : post
        )
      );
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handlePin = async (postId) => {
    try {
      await togglePostPin(postId);
      const updatedPosts = await fetchPostsByCategory(id);
      setPosts(updatedPosts);
    } catch (err) {
      console.error('Error toggling pin:', err);
    }
  };

  return (
    <Layout>
    <div className="p-6">
      <Link
        to="/forum"
        className="text-sm text-blue-600 hover:underline inline-block mb-2"
      >
        ← Back to Categories
      </Link>

      <h2 className="text-xl font-bold mb-4">📝 Posts in this Category</h2>

      <Link
        to={`/forum/new/${id}`}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Create New Post
      </Link>

      <ul className="space-y-6 mt-4">
        {posts.map((post) => (
          <li key={post._id} className={`border p-4 rounded shadow ${post.pinned ? 'bg-yellow-50' : ''}`}>        
            <h3 className="text-lg font-semibold mb-1">
              {post.pinned && '📌 '}
              <Link
                to={`/forum/post/${post._id}?category=${id}`}
                className="text-blue-700 hover:underline"
              >
                {post.title}
              </Link>
            </h3>
            <p>{post.body}</p>
            <p className="text-sm text-gray-500 mt-2">
              by {post.userId?.name || 'Anonymous'} •{' '}
              {new Date(post.createdAt).toLocaleString()}
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <button
                onClick={() => handleLike(post._id)}
                className="text-sm text-blue-600"
              >
                👍 Like ({post.likes?.length || 0})
              </button>

              {currentUser?.isAdmin && (
                <button
                  onClick={() => handlePin(post._id)}
                  className="text-sm text-yellow-600"
                >
                  {post.pinned ? 'Unpin' : 'Pin'}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
    </Layout>
  );
};

export default ForumCategoryPage;
