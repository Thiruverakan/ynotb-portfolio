const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const mockDbStore = require('../config/mockDbStore');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Owner only)
const getUsers = async (req, res) => {
  try {
    if (global.useMockDb) {
      const users = mockDbStore.find('users');
      // Populate role
      const populatedUsers = users.map(user => {
        const role = mockDbStore.findById('roles', user.role) || { name: 'Software Engineer' };
        // Delete password from output
        const userCopy = { ...user };
        delete userCopy.password;
        return { ...userCopy, role };
      });
      return res.json({ success: true, users: populatedUsers });
    }

    const users = await User.find({}).populate('role');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Private (Owner only)
const createUser = async (req, res) => {
  const { name, username, password, roleId } = req.body;

  try {
    if (global.useMockDb) {
      // Check if user already exists
      const userExists = mockDbStore.findOne('users', { username });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // Check if role exists
      const role = mockDbStore.findById('roles', roleId);
      if (!role) {
        return res.status(400).json({ success: false, message: 'Invalid role selection' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = mockDbStore.create('users', {
        name,
        username,
        password: hashedPassword,
        role: roleId,
        isActive: true
      });

      const userCopy = { ...user };
      delete userCopy.password;
      userCopy.role = role;

      return res.status(201).json({
        success: true,
        user: userCopy
      });
    }

    // Standard MongoDB logic
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ success: false, message: 'Invalid role selection' });
    }

    const user = await User.create({
      name,
      username,
      password,
      role: roleId
    });

    const populatedUser = await User.findById(user._id).populate('role');

    res.status(201).json({
      success: true,
      user: populatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private (Owner only)
const updateUser = async (req, res) => {
  const { name, username, roleId, isActive, password } = req.body;

  try {
    if (global.useMockDb) {
      const user = mockDbStore.findById('users', req.params.id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const userIdStr = user._id || user.id;
      const currentUserIdStr = req.user._id || req.user.id;

      if (userIdStr === currentUserIdStr) {
        if (isActive === false) {
          return res.status(400).json({ success: false, message: 'Owner cannot deactivate their own account' });
        }
        const currentRole = mockDbStore.findById('roles', user.role);
        if (currentRole && currentRole.name === 'Owner' && roleId && roleId !== user.role.toString()) {
          return res.status(400).json({ success: false, message: 'Cannot demote the main Owner account' });
        }
      }

      if (username && username !== user.username) {
        const usernameTaken = mockDbStore.findOne('users', { username });
        if (usernameTaken) {
          return res.status(400).json({ success: false, message: 'Username already taken by another user' });
        }
        user.username = username;
      }

      if (name) user.name = name;
      if (isActive !== undefined) user.isActive = isActive;
      
      if (roleId) {
        const roleExists = mockDbStore.findById('roles', roleId);
        if (!roleExists) {
          return res.status(400).json({ success: false, message: 'Invalid role selection' });
        }
        user.role = roleId;
      }

      if (password && password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      mockDbStore.findByIdAndUpdate('users', userIdStr, user);
      
      const updatedUser = mockDbStore.findById('users', userIdStr);
      const role = mockDbStore.findById('roles', updatedUser.role) || { name: 'Software Engineer' };
      const userCopy = { ...updatedUser };
      delete userCopy.password;
      userCopy.role = role;

      return res.json({ success: true, user: userCopy });
    }

    // Standard MongoDB logic
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.id === req.user.id) {
      if (isActive === false) {
        return res.status(400).json({ success: false, message: 'Owner cannot deactivate their own account' });
      }
      const currentRole = await Role.findById(user.role);
      if (currentRole.name === 'Owner' && roleId && roleId !== user.role.toString()) {
        return res.status(400).json({ success: false, message: 'Cannot demote the main Owner account' });
      }
    }

    if (username && username !== user.username) {
      const usernameTaken = await User.findOne({ username });
      if (usernameTaken) {
        return res.status(400).json({ success: false, message: 'Username already taken by another user' });
      }
      user.username = username;
    }

    if (name) user.name = name;
    if (isActive !== undefined) user.isActive = isActive;
    
    if (roleId) {
      const roleExists = await Role.findById(roleId);
      if (!roleExists) {
        return res.status(400).json({ success: false, message: 'Invalid role selection' });
      }
      user.role = roleId;
    }

    if (password && password.trim() !== '') {
      user.password = password;
    }

    await user.save();
    const updatedUser = await User.findById(user._id).populate('role');

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (Owner only)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (global.useMockDb) {
      const user = mockDbStore.findById('users', userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const currentUserIdStr = req.user._id || req.user.id;
      const userIdStr = user._id || user.id;

      if (userIdStr === currentUserIdStr) {
        return res.status(400).json({ success: false, message: 'Owner cannot delete their own account' });
      }

      mockDbStore.findByIdAndDelete('users', userId);
      return res.json({ success: true, message: 'User removed successfully' });
    }

    // Standard MongoDB logic
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Owner cannot delete their own account' });
    }

    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all available roles
// @route   GET /api/users/roles
// @access  Private (Owner only)
const getRoles = async (req, res) => {
  try {
    if (global.useMockDb) {
      const roles = mockDbStore.find('roles');
      return res.json({ success: true, roles });
    }

    const roles = await Role.find({});
    res.json({ success: true, roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser, getRoles };
