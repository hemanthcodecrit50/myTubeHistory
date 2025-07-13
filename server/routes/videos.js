

const express = require("express");

const { getAllVideos } = require("../controllers/videosController");

const router = express.Router();

router.get("/", getAllVideos);

module.exports = router;
