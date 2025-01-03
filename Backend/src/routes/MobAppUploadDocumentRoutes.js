const express = require('express');
const router = express.Router();
const { uploadDocument } = require('../controllers/MobApp/documentController');

// POST request for file upload
router.post('/upload', uploadDocument);

module.exports = router;
