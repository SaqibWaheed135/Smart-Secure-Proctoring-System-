const express = require('express');
const router = express.Router();
const { uploadSelfie,getSelfies } = require('../controllers/MobApp/selfieController');

// POST request for file upload
router.post('/upload', uploadSelfie);
router.get('/get-selfies', getSelfies);

module.exports = router;
