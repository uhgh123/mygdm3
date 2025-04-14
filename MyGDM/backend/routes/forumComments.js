const express = require('express');
const router = express.Router();
const ForumComment = require('../models/ForumComment');
const auth = require('../middleware/authMiddleware');

// Get comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await ForumComment.find({ postId: req.params.postId })
      .populate('userId', 'name')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// Create a comment
// ✅ expects postId in req.body, not URL
router.post('/', auth, async (req, res) => {
  const { postId, body, parentCommentId } = req.body;
  try {
    const comment = new ForumComment({
      postId,
      userId: req.user.id,
      body,
      parentCommentId: parentCommentId || null,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});


// Update a comment
router.put('/:id', auth, async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    comment.body = req.body.body || comment.body;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete a comment
// Delete a comment (owner or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // 🧠 Only the owner of the comment or an admin can delete
    if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await ForumComment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Error deleting comment' });
  }
});

module.exports = router;
