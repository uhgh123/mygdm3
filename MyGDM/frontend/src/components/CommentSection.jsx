import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/forum/comments';
const getToken = () => localStorage.getItem('token');

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState('');

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        BASE_URL,
        { postId, body },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setBody('');
      setComments((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="text-lg font-semibold mb-2">💬 Comments</h4>

      <form onSubmit={handleComment} className="flex flex-col gap-2 mb-4">
        <textarea
          placeholder="Write your reply..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="self-end bg-blue-600 text-white px-4 py-1 rounded">
          Post Comment
        </button>
      </form>

      <ul className="space-y-3">
        {comments.map((c) => (
          <li key={c._id} className="border p-3 rounded bg-gray-50">
            <p>{c.body}</p>
            <p className="text-sm text-gray-500 mt-1">
              {c.userId?.name || 'Anonymous'} • {new Date(c.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
