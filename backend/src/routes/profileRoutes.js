const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// GET /api/profile  -> get the (first) profile
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({});
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/profile -> create (or upsert by email)
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    if (!body.email || !body.name) return res.status(400).json({ message: 'name and email required' });

    const profile = await Profile.findOneAndUpdate(
      { email: body.email },
      { $set: body, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/profile -> update the existing profile (upsert)
router.put('/', async (req, res) => {
  try {
    const body = req.body;
    const profile = await Profile.findOneAndUpdate({}, { $set: body, updatedAt: new Date() }, { upsert: true, new: true });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profile/projects?skill=react  -> returns projects (optionally filtered by skill)
router.get('/projects', async (req, res) => {
  try {
    const { skill } = req.query;
    const profile = await Profile.findOne({});
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    let projects = profile.projects || [];
    if (skill) {
      const skillLower = skill.toLowerCase();
      projects = projects.filter(p =>
        (p.skills || []).map(s => String(s).toLowerCase()).includes(skillLower) ||
        (p.title || '').toLowerCase().includes(skillLower) ||
        (p.description || '').toLowerCase().includes(skillLower)
      );
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profile/skills/top -> aggregated skills counts (based on profile.skills)
router.get('/skills/top', async (req, res) => {
  try {
    const profile = await Profile.findOne({});
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const counts = {};
    (profile.skills || []).forEach(s => {
      const k = String(s).toLowerCase();
      counts[k] = (counts[k] || 0) + 1;
    });
    const arr = Object.entries(counts).map(([skill, count]) => ({ skill, count })).sort((a, b) => b.count - a.count);
    res.json(arr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profile/search?q=... -> searches name, email, education, project titles & descriptions
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const skill = (req.query.skill || '').trim();
    const profile = await Profile.findOne({});
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    // If skill given, return projects only
    if (skill) {
      const projects = (profile.projects || []).filter(p =>
        (p.skills || []).map(s => String(s).toLowerCase()).includes(skill.toLowerCase())
      );
      return res.json(projects);
    }

    if (!q) return res.json([profile]);

    const regex = new RegExp(q, 'i');
    const matches = [];

    // check profile fields
    if (regex.test(profile.name) || regex.test(profile.email) || regex.test(profile.education) || (profile.skills || []).some(s => regex.test(s))) {
      matches.push(profile);
    } else {
      // check projects
      const matchedProjects = (profile.projects || []).filter(p => regex.test(p.title) || regex.test(p.description));
      if (matchedProjects.length > 0) {
        // return profile with only matched projects
        const p = profile.toObject();
        p.projects = matchedProjects;
        matches.push(p);
      }
    }

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
