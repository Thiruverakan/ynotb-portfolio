const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(getProjects)
  .post(protect, authorize('Owner', 'Admin'), createProject);

router.route('/:id')
  .get(getProjectById)
  .put(protect, authorize('Owner', 'Admin'), updateProject)
  .delete(protect, authorize('Owner', 'Admin'), deleteProject);

module.exports = router;
