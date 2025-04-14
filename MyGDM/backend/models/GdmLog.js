const mongoose = require('mongoose');

const gdmLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  glucoseLevel: {
    type: Number,
    required: true,
  },
  mealType: {
    type: String,
    required: true,
  },
  food: {
    type: String,
    default: '',
  },
  activity: {
    type: String,
    default: '',
  },
  mood: {
    type: String,
    enum: ['Happy', 'Neutral', 'Tired', 'Stressed', 'Sad', ''],
    default: '',
  },
  medication: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('GdmLog', gdmLogSchema);
