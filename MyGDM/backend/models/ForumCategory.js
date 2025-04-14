const mongoose = require('mongoose');

const forumCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

module.exports = mongoose.model('ForumCategory', forumCategorySchema);
