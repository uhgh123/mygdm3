import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/forum';
const getToken = () => localStorage.getItem('token');
const BASE_COMMENT_URL = 'http://localhost:5000/api/forum/comments';

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
};

export const fetchCategories = async () => {
  const res = await axios.get(`${BASE_URL}/categories`, axiosConfig);
  return res.data;
};

export const fetchPostsByCategory = async (categoryId) => {
  const res = await axios.get(`${BASE_URL}/categories/${categoryId}/posts`, axiosConfig);
  return res.data;
};

export const createPost = async (post) => {
  const res = await axios.post(`${BASE_URL}/posts`, post, axiosConfig);
  return res.data;
};

export const togglePostLike = async (postId) => {
  const res = await axios.post(`${BASE_URL}/posts/${postId}/like`, {}, axiosConfig);
  return res.data;
};

export const togglePostPin = async (postId) => {
  const res = await axios.post(`${BASE_URL}/posts/${postId}/pin`, {}, axiosConfig);
  return res.data;
};

export const deletePost = async (postId) => {
  const res = await axios.delete(`${BASE_URL}/posts/${postId}`, axiosConfig);
  return res.data;
};

export const updatePost = async (postId, updatedData) => {
  const res = await axios.put(`${BASE_URL}/posts/${postId}`, updatedData, axiosConfig);
  return res.data;
};

export const getSinglePost = async (postId) => {
  const res = await axios.get(`${BASE_URL}/posts/${postId}`);
  return res.data;
};

export const fetchCategoryById = async (categoryId) => {
  const res = await axios.get(`${BASE_URL}/categories/${categoryId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

export const fetchPostById = async (postId) => {
  const res = await axios.get(`${BASE_URL}/posts/${postId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

// Create comment
export const createComment = async (postId, text, parentCommentId = null) => {
  const res = await axios.post(
    BASE_COMMENT_URL,
    { postId, body: text, parentCommentId },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return res.data;
};

// Get comments by post ID
export const fetchCommentsByPost = async (postId) => {
  const res = await axios.get(`${BASE_COMMENT_URL}/${postId}`);
  return res.data;
};

// Delete comment
export const deleteComment = async (commentId) => {
  const res = await axios.delete(`${BASE_COMMENT_URL}/${commentId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data;
};


// Update comment
export const updateComment = async (commentId, text) => {
  const res = await axios.put(
    `${BASE_COMMENT_URL}/${commentId}`,
    { body: text },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return res.data;
};
