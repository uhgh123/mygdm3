const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumComment',
    default: null, // null = top-level comment
  },
  body: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('ForumComment', commentSchema);
