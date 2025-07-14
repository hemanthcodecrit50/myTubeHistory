const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  channelTitle: String,
  categoryId: String,
  publishedAt: Date,
  duration: String,
  visitedAt: Date, // <-- add this line
});

module.exports = mongoose.model("Video", videoSchema);
