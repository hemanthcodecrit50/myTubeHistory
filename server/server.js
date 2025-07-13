const express = require("express");
const cors = require("cors");
const multer = require("multer");

const videoRoutes = require("./routes/videos");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(cors());
app.use(express.json());

// Route definitions
app.use("/api/upload", uploadRoutes);
app.use("/api/videos", videoRoutes);

// Error handling middleware (for multer, etc.)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = app;
