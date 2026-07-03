const express = require('express');
const router = express.Router();
const { createFeedback, getFeedbacks, deleteFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public route to submit and fetch feedback
router.route('/')
  .get(getFeedbacks)
  .post(createFeedback);

// Protected admin route to delete feedback
router.route('/:id')
  .delete(protect, authorize('Owner', 'Admin'), deleteFeedback);

module.exports = router;
