const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a team member name'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please add a role/designation'],
    trim: true
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio']
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564'
  },
  skills: {
    type: [String],
    default: []
  },
  degree: {
    type: String,
    default: ''
  },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', TeamMemberSchema);
