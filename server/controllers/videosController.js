
const sw = require("stopword");

const Video = require("../models/Video");
const categoryMap = require("../utils/categoryMap.js");
const parseISODuration = require("../utils/parseISODuration.js")


exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ publishedAt: -1 });
    res.status(200).json(videos);
  } catch (err) {
    console.error("Error fetching videos:", err.message);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

exports.getCategoryStats = async (req, res) => {
  try {
    const rawStats = await Video.aggregate([
      {
        $group: {
          _id: "$categoryId",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = rawStats.map((entry) => ({
      categoryId: entry._id,
      categoryName: categoryMap[entry._id] || `Unknown (${entry._id})`,
      count: entry.count,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error generating category stats:", err.message);
    res.status(500).json({ error: "Failed to generate stats" });
  }
};

exports.getDurationStats = async (req, res) => {
  try {
    const videos = await Video.find({}, { duration: 1 }); // fetch only duration

    const bins = {
      "Short (<4m)": 0,
      "Medium (4–20m)": 0,
      "Long (20–60m)": 0,
      "Very Long (>60m)": 0,
    };

    videos.forEach((video) => {
      const dur = parseISODuration(video.duration) || 0
      // const dur = video.duration || 0;
      if (dur < 240) bins["Short (<4m)"]++;
      else if (dur < 1200) bins["Medium (4–20m)"]++;
      else if (dur < 3600) bins["Long (20–60m)"]++;
      else bins["Very Long (>60m)"]++;
    });

    res.json(
      Object.entries(bins).map(([range, count]) => ({
        range,
        count,
      }))
    );
  } catch (err) {
    console.error("Error in duration stats:", err);
    res.status(500).json({ error: "Failed to compute duration stats" });
  }
};

exports.getRewatchFrequency = async (req, res) => {
  try {
    const result = await Video.aggregate([
      {
        $group: {
          _id: "$channelTitle",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const formatted = result.map((entry) => ({
      channelTitle: entry._id,
      count: entry.count,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error in rewatch stats:", err);
    res.status(500).json({ error: "Failed to compute rewatch stats" });
  }
};

exports.getWordFrequency = async (req, res) => {
  try {
    const videos = await Video.find({}, { title: 1 });

    const wordCounts = {};

    videos.forEach((video) => {
      if (!video.title) return;

      // Clean title: lowercase, remove punctuation
      const clean = video.title
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(" ");

      // Remove stopwords
      const filtered = sw.removeStopwords(clean);

      // Count
      filtered.forEach((word) => {
        if (word.length < 3) return; // skip tiny junk
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
    });

    const sorted = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15) // top 15

    const formatted = sorted.map(([word, count]) => ({ word, count }));

    res.json(formatted);
  } catch (err) {
    console.error("Error in word frequency stats:", err);
    res.status(500).json({ error: "Failed to analyze title words" });
  }
};



exports.getAverageWatchTime = async (req, res) => {
  try {
    const now = new Date();

    // Date boundaries
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const videos = await Video.find({
      visitedAt: { $exists: true },
    }, { visitedAt: 1, duration: 1 });

    let weekTotal = 0;
    let weekDays = new Set();

    let monthTotal = 0;
    let monthDays = new Set();

    videos.forEach(video => {
      if (!video.duration || typeof video.duration !== 'string' || video.duration.trim() === '') {
        // Skip if duration is missing or empty
        return;
      }
      const dur = parseISODuration(video.duration);
      if (!dur || isNaN(dur) || dur <= 0) {
        // Skip if duration is not a valid positive number
        return;
      }
      const visited = new Date(video.visitedAt);
      if (isNaN(visited.getTime())) {
        // Skip if visitedAt is not a valid date
        return;
      }
      // Week
      if (visited >= oneWeekAgo && visited <= now) {
        const dayKey = visited.toISOString().split("T")[0];
        weekDays.add(dayKey);
        weekTotal += dur;
      }
      // Month
      if (visited >= oneMonthAgo && visited <= now) {
        const dayKey = visited.toISOString().split("T")[0];
        monthDays.add(dayKey);
        monthTotal += dur;
      }
    });

    const avgWeekHours = (weekTotal / 3600) / (weekDays.size || 1);
    const avgMonthHours = (monthTotal / 3600) / (monthDays.size || 1);

    res.json({
      avgHoursPerDayWeek: avgWeekHours.toFixed(2),
      avgHoursPerDayMonth: avgMonthHours.toFixed(2),
    });
  } catch (err) {
    console.error("Error in average watch time:", err);
    res.status(500).json({ error: "Failed to compute average watch time" });
  }
};


exports.getWatchTimePerDay = async (req, res) => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 6); // Include today

    const videos = await Video.find(
      { visitedAt: { $gte: oneWeekAgo, $lte: now } },
      { visitedAt: 1, duration: 1 }
    );

    const dailyTotals = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date(oneWeekAgo);
      date.setDate(date.getDate() + i);
      const key = date.toISOString().split("T")[0];
      dailyTotals[key] = 0;
    }

    for (const video of videos) {
      // Validate and parse duration
      const { duration, visitedAt } = video;
      if (typeof duration !== 'string' || !duration.trim()) continue;
      const durSec = parseISODuration(duration);
      if (!durSec || isNaN(durSec) || durSec <= 0) continue;

      // Validate and format date
      const dateObj = new Date(visitedAt);
      if (isNaN(dateObj.getTime())) continue;
      const dateKey = dateObj.toISOString().split("T")[0];

      // Add to daily total if date is in range
      if (Object.prototype.hasOwnProperty.call(dailyTotals, dateKey)) {
        dailyTotals[dateKey] += durSec;
      }
    }

    const formatted = Object.entries(dailyTotals).map(([date, totalSec]) => ({
      date,
      hours: +(totalSec / 3600).toFixed(2),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error in daily watch time:", err);
    res.status(500).json({ error: "Failed to get watch time per day" });
  }
};
