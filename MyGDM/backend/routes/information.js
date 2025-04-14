// routes/information.js
const express = require('express');
const router = express.Router();
const Information = require('../models/Information');

// GET all information entries (you can add filters by group or category if needed)
router.get('/', async (req, res) => {
  try {
    const { group, category } = req.query;
    let query = {};
    if (group) query.group = group;
    if (category) query.category = category;
    const infoEntries = await Information.find(query);
    res.json(infoEntries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch information.' });
  }
});

// POST a new information entry (admin only, as desired)
router.post('/', async (req, res) => {
  try {
    const newInfo = new Information(req.body);
    const savedInfo = await newInfo.save();
    res.status(201).json(savedInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create information entry.' });
  }
});

// PUT update an information entry by id
router.put('/:id', async (req, res) => {
  try {
    const updatedInfo = await Information.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update information.' });
  }
});

// DELETE an information entry by id
router.delete('/:id', async (req, res) => {
  try {
    await Information.findByIdAndDelete(req.params.id);
    res.json({ message: 'Information entry deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete information entry.' });
  }
});

module.exports = router;
