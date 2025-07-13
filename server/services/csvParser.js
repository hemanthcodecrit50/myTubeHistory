

const csv = require("csv-parser");
const fs = require("fs");
const extractVideoId = require("../utils/extractVideoId");



function parseCSV(filepath) {
  return new Promise((resolve, reject) => {
    const ids = [];
    // Regex to match YouTube video URLs and extract the video ID
    const ytRegex = /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?v=([\w-]{11})/;
    fs.createReadStream(filepath)
      .pipe(csv())
      .on("data", (row) => {
        Object.values(row).forEach((value) => {
          if (typeof value === "string") {
            const match = value.match(ytRegex);
            if (match && match[1]) {
              ids.push(match[1]);
            }
          }
        });
      })
      .on("end", () => resolve(ids))
      .on("error", reject);
  });
}

module.exports = parseCSV;
