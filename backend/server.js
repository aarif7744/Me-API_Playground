const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { connect } = require('./src/db');
const profileRoutes = require('./src/routes/profileRoutes');

const app = express();
app.use(express.json());

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://me-api-playground-2-7wgi.onrender.com" // deployed frontend
];

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server calls or Postman
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Routes
app.use('/api/profile', profileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const port = process.env.PORT || 4000;

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch(err => console.error('DB connect error', err));
