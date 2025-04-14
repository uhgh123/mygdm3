const express = require('express');
const router = express.Router();
const ForumCategory = require('../models/ForumCategory');
const ForumPost = require('../models/ForumPost');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/admin');

// Get all forum categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await ForumCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

// Get all posts in a category, pinned first
router.get('/categories/:id/posts', async (req, res) => {
  try {
    const posts = await ForumPost.find({ categoryId: req.params.id })
      .populate('userId', 'name')
      .sort({ pinned: -1, createdAt: -1 }); // 🔥 First pinned, then newest

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
});


// Create a post
router.post('/posts', auth, async (req, res) => {
  try {
    const { title, body, categoryId } = req.body;
    const newPost = await ForumPost.create({
      userId: req.user.id,
      title,
      body,
      categoryId,
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Error creating post' });
  }
});

router.get('/posts/:id', async (req, res) => {
    try {
      const post = await ForumPost.findById(req.params.id)
        .populate('userId', 'name')
        .populate('categoryId', 'name');
      if (!post) return res.status(404).json({ error: 'Post not found' });
      res.json(post);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching post' });
    }
  });
  
// Get a single category by ID
router.get('/categories/:id', async (req, res) => {
  try {
    const category = await ForumCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching category' });
  }
});

// Like/unlike a post
router.post('/posts/:id/like', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    const userId = req.user.id;

    if (!post) return res.status(404).json({ error: 'Post not found' });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ liked: !alreadyLiked, likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: 'Error toggling like' });
  }
});

// Toggle pin (admin only)
router.post('/posts/:id/pin', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });

  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.pinned = !post.pinned;
    await post.save();
    res.json({ pinned: post.pinned });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle pin' });
  }
});

// Update post (owner only or admin)
router.put('/posts/:id', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    post.title = req.body.title || post.title;
    post.body = req.body.body || post.body;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post (owner or admin)
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await ForumPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting post' });
  }
});

module.exports = router;
