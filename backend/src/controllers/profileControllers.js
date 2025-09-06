const Profile = require("../models/Profile");

// Create or update profile by email
async function upsertProfile(req, res) {
  try {
    const data = req.body;
    const profile = await Profile.findOneAndUpdate(
      { email: data.email },
      { $set: data, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProfile(req, res) {
  try {
    const { email } = req.query;
    let profile;
    if (email) profile = await Profile.findOne({ email });
    else profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "No profile found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listProjects(req, res) {
  try {
    const { skill } = req.query;
    const match = skill ? { "projects.skills": skill } : {};
    const profiles = await Profile.find(match, { projects: 1, _id: 0 });
    const projects = profiles.flatMap((p) => p.projects || []);
    const filtered = skill
      ? projects.filter((p) => p.skills && p.skills.includes(skill))
      : projects;
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function topSkills(req, res) {
  try {
    // aggregate top skills across profiles
    const result = await Profile.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: "$skills", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function search(req, res) {
  try {
    const q = req.query.q || "";
    const regex = new RegExp(q, "i");
    const profiles = await Profile.find({
      $or: [
        { name: regex },
        { email: regex },
        { education: regex },
        { skills: regex },
        { "projects.title": regex },
        { "projects.description": regex },
      ],
    });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function health(req, res) {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
}

module.exports = {
  upsertProfile,
  getProfile,
  listProjects,
  topSkills,
  search,
  health,
};
