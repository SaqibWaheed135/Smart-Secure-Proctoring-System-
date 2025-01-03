const express = require('express');
const router = express.Router();
const { uploadRoomVideo} = require('../controllers/MobApp/roomVideoController');

// POST request for file upload
router.post('/upload', uploadRoomVideo);

module.exports = router;
