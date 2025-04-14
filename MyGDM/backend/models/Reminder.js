const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  label: { type: String, required: true },
  time: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Reminder', reminderSchema);
