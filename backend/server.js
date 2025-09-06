const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { connect } = require('./src/db');
const profileRoutes = require('./src/routes/profileRoutes');

const app = express();
app.use(express.json());

// Parse FRONTEND_URI into array
const allowedOrigins = process.env.FRONTEND_URI.split(',');

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Mount routes
app.use('/api/profile', profileRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

const port = process.env.PORT || 4000;

connect()
  .then(() => app.listen(port, () => console.log(`✅ Server running on port ${port}`)))
  .catch(err => console.error('DB connect error', err));
