// src/models/Profile.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  skills: [String],
  links: [String]
});

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  education: String,
  skills: [String],
  work: [String],
  links: {
    github: String,
    linkedin: String,
    portfolio: String
  },
  projects: [ProjectSchema] // <-- add projects array
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
