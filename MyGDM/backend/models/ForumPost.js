const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pinned: { type: Boolean, default: false }
  });
  

module.exports = mongoose.model('ForumPost', forumPostSchema);
