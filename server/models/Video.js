const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  channelTitle: String,
  categoryId: String,
  publishedAt: Date,
  duration: String,
});

module.exports = mongoose.model("Video", videoSchema);
