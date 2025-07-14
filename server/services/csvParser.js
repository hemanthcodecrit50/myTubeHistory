

const csv = require("csv-parser");
const fs = require("fs");
const extractVideoId = require("../utils/extractVideoId");



function parseCSV(filepath) {
  return new Promise((resolve, reject) => {
    const results = [];
    // Regex to match YouTube video URLs and extract the video ID
    const ytRegex = /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?v=([\w-]{11})/;
    fs.createReadStream(filepath)
      .pipe(csv())
      .on("data", (row) => {
        // Try to find a YouTube URL in any column
        let foundId = null;
        Object.values(row).forEach((value) => {
          if (typeof value === "string" && !foundId) {
            const match = value.match(ytRegex);
            if (match && match[1]) {
              foundId = match[1];
            }
          }
        });
        if (foundId) {
          // Combine date and time columns if available
          let visitedAt = null;
          if (row.date && row.time) {
            visitedAt = new Date(`${row.date} ${row.time}`);
          } else if (row.date) {
            visitedAt = new Date(row.date);
          }
          results.push({ videoId: foundId, visitedAt });
        }
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

module.exports = parseCSV;
