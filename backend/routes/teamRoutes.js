const express = require('express');
const router = express.Router();
const {
  getTeam,
  getTeamById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(getTeam)
  .post(protect, authorize('Owner', 'Admin'), createTeamMember);

router.route('/:id')
  .get(getTeamById)
  .put(protect, authorize('Owner', 'Admin'), updateTeamMember)
  .delete(protect, authorize('Owner', 'Admin'), deleteTeamMember);

module.exports = router;
