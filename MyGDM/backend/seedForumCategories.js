const mongoose = require('mongoose');
require('dotenv').config();
const ForumCategory = require('./models/ForumCategory');

const categories = [
  { name: 'Blood Glucose Management', description: 'Discuss sugar levels and logs' },
  { name: 'Meal Planning & Nutrition', description: 'Share meals, recipes, and food tips' },
  { name: 'Exercise & Activity', description: 'Talk safe exercises during pregnancy' },
  { name: 'Medication & Treatment', description: 'Ask about insulin, metformin, etc.' },
  { name: 'Mental & Emotional Wellbeing', description: 'Share your feelings, mental support' },
  { name: 'Pregnancy Journey & Birth Plans', description: 'Share trimesters, birth stories' },
  { name: 'Introductions & Meet the Community', description: 'Say hello and connect!' },
  { name: 'Partner & Family Support', description: 'For families helping someone with GDM' },
  { name: 'General Discussion', description: 'Talk about anything else' },
  { name: 'App Feedback & Suggestions', description: 'Help us improve the app' },
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  await ForumCategory.deleteMany({});
  await ForumCategory.insertMany(categories);
  console.log('✅ Forum categories seeded');
  process.exit();
}).catch((err) => {
  console.error('❌ DB Error:', err);
});
