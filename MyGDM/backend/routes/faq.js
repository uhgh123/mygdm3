// routes/faq.js
const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');

// GET all FAQs (optionally filter by category via query parameter)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const faqs = category ? await Faq.find({ category }) : await Faq.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs.' });
  }
});

// POST a new FAQ (admin only, for example)
router.post('/', async (req, res) => {
  try {
    const newFaq = new Faq(req.body);
    const savedFaq = await newFaq.save();
    res.status(201).json(savedFaq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create FAQ.' });
  }
});

// PUT update an FAQ by id
router.put('/:id', async (req, res) => {
  try {
    const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFaq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ.' });
  }
});

// DELETE an FAQ by id
router.delete('/:id', async (req, res) => {
  try {
    await Faq.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ.' });
  }
});

module.exports = router;
