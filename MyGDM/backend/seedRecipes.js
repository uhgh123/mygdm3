const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const fs = require('fs');
const path = require('path');
const Recipe = require('./models/Recipe');

const seedRecipes = async () => {
  try {
    // Connect to MongoDB using the MONGO_URI variable from .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected.');

    // Define the path to your JSON file containing the recipes
    const filePath = path.join(__dirname, 'GDMRecipes.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const recipes = JSON.parse(data);

    // Clear existing recipes in the collection
    await Recipe.deleteMany();
    // Bulk insert the new recipes
    await Recipe.insertMany(recipes);

    console.log('✅ Recipes seeded successfully!');
  } catch (error) {
    console.error('Error seeding recipes:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedRecipes();
