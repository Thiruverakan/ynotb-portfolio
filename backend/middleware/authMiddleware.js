const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mockDbStore = require('../config/mockDbStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user;
      if (global.useMockDb) {
        user = mockDbStore.findById('users', decoded.id);
        if (user) {
          // Mock populate role
          const role = mockDbStore.findById('roles', user.role);
          user.role = role || { name: 'Software Engineer' };
        }
      } else {
        user = await User.findById(decoded.id).populate('role');
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      if (!user.isActive) {
        return res.status(401).json({ success: false, message: 'Not authorized, user account is deactivated' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
