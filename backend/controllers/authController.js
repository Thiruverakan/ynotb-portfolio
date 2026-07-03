const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mockDbStore = require('../config/mockDbStore');

// Helper function to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (global.useMockDb) {
      const user = mockDbStore.findOne('users', { username });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (!user.isActive) {
        return res.status(401).json({ success: false, message: 'Account is deactivated. Contact Owner.' });
      }

      // Match password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const role = mockDbStore.findById('roles', user.role) || { name: 'Software Engineer' };

      return res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          role: role.name
        }
      });
    }

    // Standard MongoDB logic
    const user = await User.findOne({ username }).select('+password').populate('role');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated. Contact Owner.' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    if (global.useMockDb) {
      const user = mockDbStore.findById('users', req.user._id || req.user.id);
      const role = mockDbStore.findById('roles', user.role) || { name: 'Software Engineer' };
      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          role: role.name
        }
      });
    }

    const user = await User.findById(req.user.id).populate('role');
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login, getMe };
