// models/Information.js
const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  content: [{ type: String }]
});

const informationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  group: { type: String, required: true },
  sections: [sectionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Information', informationSchema);
