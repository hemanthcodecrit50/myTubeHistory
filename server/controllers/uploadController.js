

const parseCSV = require("../services/csvParser");
const fetchMetadata = require("../services/youtubeService");
const Video = require("../models/Video");
const path = require("path");


exports.handleUpload = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });


  const filepath = path.join(__dirname, "..", req.file.path);
  console.log("[DEBUG] Filepath:", filepath);
  const videoRows = await parseCSV(filepath); // [{ videoId, visitedAt }]
  console.log("[DEBUG] Parsed videoRows:", videoRows);

  // Remove duplicates by videoId, keep the first occurrence (with visitedAt)
  const seen = new Set();
  const uniqueRows = videoRows.filter(row => {
    if (seen.has(row.videoId)) return false;
    seen.add(row.videoId);
    return true;
  });
  console.log("[DEBUG] Unique video rows:", uniqueRows);
  const results = [];

  console.log("File received:", req.file.originalname);

  for (const { videoId, visitedAt } of uniqueRows) {
    const exists = await Video.findOne({ videoId });
    if (exists) {
      console.log(`[DEBUG] Video ID ${videoId} already exists in DB.`);
      continue;
    }

    const data = await fetchMetadata(videoId);
    console.log(`[DEBUG] Metadata for ${videoId}:`, data);
    if (data) {
      if (!data.duration) {
        console.warn(`[WARN] No duration for videoId ${videoId}. This video will not contribute to watch time stats.`);
      }
      // Add visitedAt to the data before saving
      const saved = await Video.create({ ...data, visitedAt });
      results.push(saved);
    } else {
      console.log(`[DEBUG] No metadata found for ${videoId}.`);
    }
  }

  console.log(`[DEBUG] Total new videos saved: ${results.length}`);
  res.status(200).json({ message: "Upload complete", count: results.length });
};
