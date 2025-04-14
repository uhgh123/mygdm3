const express = require('express');
const router = express.Router();
const GdmLog = require('../models/GdmLog');
const protect = require('../middleware/authMiddleware');

// POST - Create log (protected)
// POST - Create log (protected)
router.post('/', protect, async (req, res) => {
  const {
    glucoseLevel,
    mealType,
    food,
    activity,
    mood,
    medication,
    notes,
    timestamp,
  } = req.body;

  try {
    const log = await GdmLog.create({
      userId: req.user._id,
      glucoseLevel,
      mealType,
      food,
      activity,
      mood,
      medication,
      notes,
      timestamp,
    });

    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

  

// GET - All logs for this user (protected)
router.get('/', protect, async (req, res) => {
  try {
    const logs = await GdmLog.find({ userId: req.user._id }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
});

// PUT - Edit a log
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedLog = await GdmLog.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    res.json(updatedLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Delete a log
router.delete('/:id', protect, async (req, res) => {
  try {
    await GdmLog.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;


