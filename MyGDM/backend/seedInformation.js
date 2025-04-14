// seedInformation.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Information = require('./models/Information');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB for Information seeding');
    const data = fs.readFileSync(path.join(__dirname, 'GDMInfo.json'), 'utf-8');
    const infos = JSON.parse(data);
    await Information.deleteMany();
    await Information.insertMany(infos);
    console.log('Information data seeded successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
