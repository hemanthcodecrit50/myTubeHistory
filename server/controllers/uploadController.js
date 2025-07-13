

const parseCSV = require("../services/csvParser");
const fetchMetadata = require("../services/youtubeService");
const Video = require("../models/Video");
const path = require("path");


exports.handleUpload = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filepath = path.join(__dirname, "..", req.file.path);
  console.log("[DEBUG] Filepath:", filepath);
  const videoIds = await parseCSV(filepath);
  console.log("[DEBUG] Parsed videoIds:", videoIds);

  const uniqueIds = [...new Set(videoIds)];
  console.log("[DEBUG] Unique videoIds:", uniqueIds);
  const results = [];

  console.log("File received:", req.file.originalname);

  for (const id of uniqueIds) {
    const exists = await Video.findOne({ videoId: id });
    if (exists) {
      console.log(`[DEBUG] Video ID ${id} already exists in DB.`);
      continue;
    }

    const data = await fetchMetadata(id);
    console.log(`[DEBUG] Metadata for ${id}:`, data);
    if (data) {
      const saved = await Video.create(data);
      results.push(saved);
    } else {
      console.log(`[DEBUG] No metadata found for ${id}.`);
    }
  }

  console.log(`[DEBUG] Total new videos saved: ${results.length}`);
  res.status(200).json({ message: "Upload complete", count: results.length });
};
