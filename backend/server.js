const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { connect } = require("./src/db");
const profileRoutes = require("./src/routes/profileRoutes");

const app = express();
app.use(express.json());

// ✅ Parse FRONTEND_URI into array (handles multiple URIs separated by commas)
const allowedOrigins = process.env.FRONTEND_URI
  ? process.env.FRONTEND_URI.split(",").map((uri) => uri.trim())
  : [];

// ✅ Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Root route (avoids 500 error when hitting base URL)
app.get("/", (req, res) => {
  res.json({
    message: "API is running 🚀",
    endpoints: {
      profile: "/api/profile",
      health: "/api/health",
    },
  });
});

// ✅ Mount routes
app.use("/api/profile", profileRoutes);

// ✅ Health check route
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

const port = process.env.PORT || 4000;

// ✅ Connect DB & start server
connect()
  .then(() =>
    app.listen(port, () =>
      console.log(`✅ Server running on port ${port}`)
    )
  )
  .catch((err) => console.error("❌ DB connection error:", err));
