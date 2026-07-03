const Project = require('../models/Project');
const mockDbStore = require('../config/mockDbStore');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    if (global.useMockDb) {
      const projects = mockDbStore.find('projects');
      // Sort by createdAt desc equivalent
      const sortedProjects = [...projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, count: sortedProjects.length, projects: sortedProjects });
    }

    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    if (global.useMockDb) {
      const project = mockDbStore.findById('projects', req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      return res.json({ success: true, project });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Owner, Admin)
const createProject = async (req, res) => {
  try {
    if (global.useMockDb) {
      const project = mockDbStore.create('projects', {
        ...req.body,
        technologies: Array.isArray(req.body.technologies) 
          ? req.body.technologies 
          : (req.body.technologies ? [req.body.technologies] : ['React', 'Node.js']),
        imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426',
        createdAt: new Date().toISOString()
      });
      return res.status(201).json({ success: true, project });
    }

    const project = await Project.create(req.body);
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Owner, Admin)
const updateProject = async (req, res) => {
  try {
    if (global.useMockDb) {
      const projectExists = mockDbStore.findById('projects', req.params.id);
      if (!projectExists) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      const updated = mockDbStore.findByIdAndUpdate('projects', req.params.id, req.body);
      return res.json({ success: true, project: updated });
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Owner, Admin)
const deleteProject = async (req, res) => {
  try {
    if (global.useMockDb) {
      const project = mockDbStore.findById('projects', req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      mockDbStore.findByIdAndDelete('projects', req.params.id);
      return res.json({ success: true, message: 'Project deleted successfully' });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
