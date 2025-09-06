const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { connect } = require('./src/db');
const profileRoutes = require('./src/routes/profileRoutes');

const app = express();
app.use(express.json());

// Allow frontend origin or fallback to *
app.use(cors({
  origin: "'http://localhost:5173',https://me-api-playground-2-7wgi.onrender.com",   // allow Vite frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Mount profile routes at /api/profile
app.use('/api/profile', profileRoutes);

// health endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

const port = process.env.PORT || 4000;

connect()
  .then(() => app.listen(port, () => console.log(`Server running on http://localhost:${port}`)))
  .catch(err => console.error('DB connect error', err));
