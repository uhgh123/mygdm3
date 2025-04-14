const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const authMiddleware = require('../middleware/authMiddleware');

// Create new reminder
router.post('/', authMiddleware, async (req, res) => {
  try {
    const reminder = new Reminder({ ...req.body, userId: req.user.id });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

// Get reminders for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

// Update reminder
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reminder' });
  }
});

// Delete reminder
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
});

module.exports = router;
