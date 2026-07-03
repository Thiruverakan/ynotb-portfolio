const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true
  },
  category: {
    type: String,
    enum: ['University', 'Business'],
    default: 'University'
  },
  duration: {
    type: String,
    default: ''
  },
  price: {
    type: String,
    default: ''
  },
  clientName: {
    type: String,
    default: ''
  },
  clientEmail: {
    type: String,
    default: ''
  },
  clientPhone: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Progress', 'Complete', 'Omit'],
    default: 'Progress'
  },
  dueDate: {
    type: Date
  },
  // Keep these fields optional to preserve public UI layouts
  description: {
    type: String,
    default: 'Custom business and academic engineering solutions.'
  },
  longDescription: {
    type: String,
    default: 'Custom business and academic engineering solutions.'
  },
  technologies: {
    type: [String],
    default: ['React', 'Node.js', 'Express', 'MongoDB']
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426'
  },
  githubLink: {
    type: String,
    default: ''
  },
  liveLink: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
