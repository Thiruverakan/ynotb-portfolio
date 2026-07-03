const TeamMember = require('../models/TeamMember');
const mockDbStore = require('../config/mockDbStore');

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
const getTeam = async (req, res) => {
  try {
    if (global.useMockDb) {
      const team = mockDbStore.find('teamMembers');
      return res.json({ success: true, count: team.length, team });
    }

    const team = await TeamMember.find({});
    res.json({ success: true, count: team.length, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single team member by ID
// @route   GET /api/team/:id
// @access  Public
const getTeamById = async (req, res) => {
  try {
    if (global.useMockDb) {
      const member = mockDbStore.findById('teamMembers', req.params.id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }
      return res.json({ success: true, member });
    }

    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new team member
// @route   POST /api/team
// @access  Private (Owner, Admin)
const createTeamMember = async (req, res) => {
  try {
    if (global.useMockDb) {
      const member = mockDbStore.create('teamMembers', {
        ...req.body,
        imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564',
        createdAt: new Date().toISOString()
      });
      return res.status(201).json({ success: true, member });
    }

    const member = await TeamMember.create(req.body);
    res.status(201).json({ success: true, member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private (Owner, Admin)
const updateTeamMember = async (req, res) => {
  try {
    if (global.useMockDb) {
      const memberExists = mockDbStore.findById('teamMembers', req.params.id);
      if (!memberExists) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }
      const member = mockDbStore.findByIdAndUpdate('teamMembers', req.params.id, req.body);
      return res.json({ success: true, member });
    }

    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    res.json({ success: true, member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private (Owner, Admin)
const deleteTeamMember = async (req, res) => {
  try {
    if (global.useMockDb) {
      const member = mockDbStore.findById('teamMembers', req.params.id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }
      mockDbStore.findByIdAndDelete('teamMembers', req.params.id);
      return res.json({ success: true, message: 'Team member removed successfully' });
    }

    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team member removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTeam,
  getTeamById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
};
