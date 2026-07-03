const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser, getRoles } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All user management routes are restricted to Owner only
router.use(protect);
router.use(authorize('Owner'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.get('/roles', getRoles);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
