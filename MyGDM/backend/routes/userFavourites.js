const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // adjust to your auth middleware

// GET favorites
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    // Make sure your auth middleware sets req.user (e.g., user id)
    const user = await User.findById(req.user._id).populate('favorites');
    return res.json(user.favorites);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to get favorites' });
  }
});

// POST favorite
router.post('/favorites', authMiddleware, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
    }
    res.json({ message: 'Recipe added to favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// DELETE favorite
router.delete('/favorites/:recipeId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== req.params.recipeId
    );
    await user.save();
    res.json({ message: 'Recipe removed from favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

module.exports = router;
