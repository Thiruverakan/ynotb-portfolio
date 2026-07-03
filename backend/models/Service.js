const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true,
    unique: true
  },
  icon: {
    type: String,
    required: [true, 'Please add an icon identifier (e.g., code, server, mobile, palette)'],
    default: 'code'
  },
  description: {
    type: String,
    required: [true, 'Please add a service description']
  },
  priceRange: {
    type: String,
    default: 'Contact for pricing'
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
