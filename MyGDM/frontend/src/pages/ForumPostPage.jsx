import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  fetchPostById,
  fetchCommentsByPost,
  createComment,
  deleteComment,
  updateComment,
  deletePost,
  updatePost,
  fetchCategoryById
} from '../services/forumApi';

const ForumPostPage = () => {
  const { id: postId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get('category');

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [editingPost, setEditingPost] = useState(false);
  const [editPostForm, setEditPostForm] = useState({ title: '', body: '' });
  const [categoryName, setCategoryName] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(null);
  const [replyText, setReplyText] = useState('');

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

    if (categoryId) {
      fetchCategoryById(categoryId)
        .then((cat) => setCategoryName(cat.name))
        .catch(() => setCategoryName('Category'));
    }

    loadPostAndComments();
  }, [postId, categoryId]);

  const loadPostAndComments = async () => {
    const postData = await fetchPostById(postId);
    const commentData = await fetchCommentsByPost(postId);

    console.log('Fetched commentData:', commentData);
    
    setPost(postData);
    setComments(commentData);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await createComment(postId, commentText);
    setCommentText('');
    loadPostAndComments();
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    await createComment(postId, replyText, parentId);
    setReplyText('');
    setShowReplyBox(null);
    loadPostAndComments();
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    loadPostAndComments();
  };

  const handleEditComment = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    await updateComment(editingCommentId, editingCommentText);
    setEditingCommentId(null);
    setEditingCommentText('');
    loadPostAndComments();
  };

  const handleEditPostClick = () => {
    setEditPostForm({ title: post.title, body: post.body });
    setEditingPost(true);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    await updatePost(post._id, editPostForm);
    setEditingPost(false);
    loadPostAndComments();
  };

  const handleDeletePost = async () => {
    await deletePost(post._id);
    window.location.href = `/forum/category/${categoryId}`;
  };

  

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <Link 
          to={`/forum/category/${categoryId}`} 
          className="text-blue-600 text-sm mb-4 inline-block">
          ← Back to {categoryName}
        </Link>

        {post && (
          <>
            {editingPost ? (
              <form onSubmit={handleUpdatePost} className="space-y-2 mb-4">
                <input
                  type="text"
                  value={editPostForm.title}
                  onChange={(e) =>
                    setEditPostForm({ ...editPostForm, title: e.target.value })
                  }
                  className="border p-2 w-full"
                  required
                />
                <textarea
                  value={editPostForm.body}
                  onChange={(e) =>
                    setEditPostForm({ ...editPostForm, body: e.target.value })
                  }
                  className="border p-2 w-full"
                  required
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Save
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingPost(false)}
                  className="ml-2 text-gray-600">
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">
                  {post.pinned && '📌 '}
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-2">
                  by {post.userId?.name || 'Anonymous'} • {new Date(post.createdAt).toLocaleString()}
                </p>
                <p className="mb-4">{post.body}</p>
                {(currentUser?.id === post.userId?._id || currentUser?.isAdmin) && (
                  <div className="flex gap-4 mb-6">
                    <button onClick={handleEditPostClick} className="text-blue-600">
                      ✏️ Edit Post
                    </button>
                    <button onClick={handleDeletePost} className="text-red-600">
                      🗑️ Delete Post
                    </button>
                  </div>
                )}
              </>
            )}
            <h3 className="text-xl font-semibold mb-2">💬 Comments</h3>
            <form onSubmit={handleAddComment} className="mb-4">
              <textarea
                className="w-full border p-2 rounded"
                rows="3"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
                Post Comment
              </button>
            </form>
            <ul className="space-y-4">
              {comments.filter(c => !c.parentCommentId).map(comment => (
                <li key={comment._id} className="border p-3 rounded">
                  <p className="text-sm text-gray-500 mb-1">
                    {comment.userId?.name || 'Anonymous'} •{' '}
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  {editingCommentId === comment._id ? (
                    <form onSubmit={handleUpdateComment}>
                      <textarea
                        className="w-full border p-2"
                        rows="2"
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        required
                      />
                      <div className="mt-2 flex gap-2">
                        <button type="submit" className="btn">💾 Save</button>
                        <button
                          type="button"
                          className="btn-outline"
                          onClick={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p>{comment.body}</p>
                      <div className="flex gap-4 text-sm mt-2">
                        {currentUser?.id === comment.userId?._id && (
                          <>
                            <button
                              onClick={() => handleEditComment(comment._id, comment.body)}
                              className="text-blue-600"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-red-600"
                            >
                              🗑️ Delete
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setShowReplyBox(comment._id)}
                          className="text-blue-600"
                        >
                          ↩️ Reply
                        </button>
                      </div>
                    </>
                  )}
                  {showReplyBox === comment._id && (
                    <form onSubmit={(e) => handleReplySubmit(e, comment._id)} className="mt-2">
                      <textarea
                        className="w-full border p-2 rounded"
                        rows="2"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                      />
                      <div className="mt-2 flex gap-2">
                        <button type="submit" className="btn">Post Reply</button>
                        <button type="button" className="btn-outline" onClick={() => setShowReplyBox(null)}>
                          Cancel
                        </button>
                      </div>
                    </form>
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

export default ForumPostPage;
