// seedFaqs.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Faq = require('./models/Faq');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB for FAQ seeding');
    const data = fs.readFileSync(path.join(__dirname, 'GDMFaq.json'), 'utf-8');
    const faqs = JSON.parse(data);
    await Faq.deleteMany();
    await Faq.insertMany(faqs);
    console.log('FAQs seeded successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
