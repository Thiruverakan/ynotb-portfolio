const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public route to send message
router.post('/', createMessage);

// Protected routes to manage messages
router.route('/')
  .get(protect, authorize('Owner', 'Admin', 'Software Engineer'), getMessages);

router.route('/:id')
  .put(protect, authorize('Owner', 'Admin'), updateMessageStatus)
  .delete(protect, authorize('Owner', 'Admin'), deleteMessage);

module.exports = router;
