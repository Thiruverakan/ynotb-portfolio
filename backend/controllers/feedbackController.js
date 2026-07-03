const Feedback = require('../models/Feedback');
const mockDbStore = require('../config/mockDbStore');

// @desc    Submit user feedback
// @route   POST /api/feedbacks
// @access  Public
const createFeedback = async (req, res) => {
  try {
    const { name, country, rating, comment } = req.body;

    if (!name || !country || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide all feedback fields' });
    }

    const ratingVal = Number(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    if (global.useMockDb) {
      const newFeedback = mockDbStore.create('feedbacks', {
        name,
        country,
        rating: ratingVal,
        comment,
        createdAt: new Date().toISOString()
      });
      return res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully. Thank you for your support!',
        data: newFeedback
      });
    }

    const newFeedback = await Feedback.create({
      name,
      country,
      rating: ratingVal,
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. Thank you for your support!',
      data: newFeedback
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all feedback reviews
// @route   GET /api/feedbacks
// @access  Public
const getFeedbacks = async (req, res) => {
  try {
    if (global.useMockDb) {
      const feedbacks = mockDbStore.find('feedbacks');
      const sortedFeedbacks = [...feedbacks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, count: sortedFeedbacks.length, feedbacks: sortedFeedbacks });
    }

    const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a feedback review
// @route   DELETE /api/feedbacks/:id
// @access  Private (Owner, Admin)
const deleteFeedback = async (req, res) => {
  try {
    if (global.useMockDb) {
      const feedback = mockDbStore.findById('feedbacks', req.params.id);
      if (!feedback) {
        return res.status(404).json({ success: false, message: 'Feedback not found' });
      }
      mockDbStore.findByIdAndDelete('feedbacks', req.params.id);
      return res.json({ success: true, message: 'Feedback deleted successfully' });
    }

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
  deleteFeedback
};
