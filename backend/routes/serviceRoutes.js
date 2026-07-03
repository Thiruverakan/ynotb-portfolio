const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(getServices)
  .post(protect, authorize('Owner', 'Admin'), createService);

router.route('/:id')
  .get(getServiceById)
  .put(protect, authorize('Owner', 'Admin'), updateService)
  .delete(protect, authorize('Owner', 'Admin'), deleteService);

module.exports = router;
