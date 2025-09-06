// seed.js - run `node src/seed.js`
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Profile = require('./models/Profile');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/me_api_playground';

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to', uri);

    const me = {
      name: 'Mohd Aarif',
      email: 'aarif@example.com',
      education: 'B.Tech Computer Science - Invertis University',
      skills: ['nodejs', 'express', 'mongodb', 'react', 'docker'],
      projects: [
        {
          title: 'MERN Collaborative Whiteboard',
          description: 'Real-time collaborative whiteboard using Socket.io',
          links: ['https://github.com/your/repo'],
          skills: ['nodejs', 'socket.io', 'react']
        },
        {
          title: 'Job Portal',
          description: 'MERN job portal with Redux and MongoDB',
          links: ['https://github.com/your/job-portal'],
          skills: ['nodejs', 'express', 'react']
        }
      ],
      work: ['Head of Sales & Marketing - Su-Power Cooler'],
      links: {
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourprofile',
        portfolio: 'https://your.site'
      }
    };

    await Profile.findOneAndUpdate({ email: me.email }, me, { upsert: true, new: true });
    console.log('Seeded profile');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
