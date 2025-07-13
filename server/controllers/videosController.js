



const Video = require("../models/Video");

// GET /api/videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ publishedAt: -1 });
    res.status(200).json(videos);
  } catch (err) {
    console.error("Error fetching videos:", err.message);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};
