const Service = require('../models/Service');
const mockDbStore = require('../config/mockDbStore');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    if (global.useMockDb) {
      const services = mockDbStore.find('services');
      return res.json({ success: true, count: services.length, services });
    }

    const services = await Service.find({});
    res.json({ success: true, count: services.length, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    if (global.useMockDb) {
      const service = mockDbStore.findById('services', req.params.id);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      return res.json({ success: true, service });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Owner, Admin)
const createService = async (req, res) => {
  try {
    const { name, icon, description, priceRange } = req.body;

    if (global.useMockDb) {
      const serviceExists = mockDbStore.findOne('services', { name });
      if (serviceExists) {
        return res.status(400).json({ success: false, message: 'Service name already exists' });
      }

      const service = mockDbStore.create('services', {
        name,
        icon: icon || 'code',
        description,
        priceRange: priceRange || 'Contact for pricing'
      });
      return res.status(201).json({ success: true, service });
    }

    // Standard MongoDB logic
    const serviceExists = await Service.findOne({ name });
    if (serviceExists) {
      return res.status(400).json({ success: false, message: 'Service name already exists' });
    }

    const service = await Service.create({ name, icon, description, priceRange });
    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Owner, Admin)
const updateService = async (req, res) => {
  try {
    if (global.useMockDb) {
      const serviceExists = mockDbStore.findById('services', req.params.id);
      if (!serviceExists) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      const service = mockDbStore.findByIdAndUpdate('services', req.params.id, req.body);
      return res.json({ success: true, service });
    }

    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Owner, Admin)
const deleteService = async (req, res) => {
  try {
    if (global.useMockDb) {
      const service = mockDbStore.findById('services', req.params.id);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      mockDbStore.findByIdAndDelete('services', req.params.id);
      return res.json({ success: true, message: 'Service deleted successfully' });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
