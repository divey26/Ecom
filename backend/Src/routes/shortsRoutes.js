const express = require('express');
const router = express.Router();
const { addVideo, getProductById, getAllVideos } = require('../controllers/ShortsController'); // Import the controller

// POST route to add a video URL and productId
router.post('/add-video', addVideo);

// GET route to fetch video by productId
router.get('/get-video/:productId', getProductById); // Add productId to the URL

// GET route to fetch all videos with respective productIds
router.get('/get-all-videos', getAllVideos);

module.exports = router;
