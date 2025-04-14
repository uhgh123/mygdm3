const express = require("express");
const Recipe = require("../models/Recipe");
const router = express.Router();

// GET /api/recipes - Retrieve all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
});

// POST /api/recipes - Create a new recipe (manual addition)
router.post("/", async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to create recipe." });
  }
});

// GET /api/recipes/:id - Retrieve a single recipe by its ID
router.get("/:id", async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found." });
      }
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipe." });
    }
  });
  
module.exports = router;
