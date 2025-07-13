


const { google } = require("googleapis");

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

async function fetchMetadata(videoId) {
  try {
    const res = await youtube.videos.list({
      part: "snippet,contentDetails",
      id: videoId,
    });

    const item = res.data.items[0];
    if (!item) return null;

    videoStuff = {
      videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      categoryId: item.snippet.categoryId,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
    }

    console.log(videoStuff)

    return videoStuff;
  } catch (err) {
    console.error(`Error fetching video ${videoId}:`, err.message);
    return null;
  }
}

module.exports = fetchMetadata;
