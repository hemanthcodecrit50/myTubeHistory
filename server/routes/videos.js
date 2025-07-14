

const express = require("express");

const router = express.Router();

const { getAllVideos , getCategoryStats, getDurationStats, 
        getRewatchFrequency, getWordFrequency, getAverageWatchTime,
        getWatchTimePerDay
    } = require("../controllers/videosController");


router.get("/", getAllVideos);
router.get("/stats/categories", getCategoryStats);
router.get("/stats/duration", getDurationStats); 
router.get("/stats/rewatch", getRewatchFrequency);
router.get("/stats/words", getWordFrequency);
router.get("/stats/watchtime", getAverageWatchTime);
router.get("/stats/watchtime/daily", getWatchTimePerDay);

module.exports = router;

