const express = require('express');
const router = express.Router();
const { generateQRCode} = require('../controllers/QrCode');

// Route for adding a candidate
router.get('/generate-qr', generateQRCode);

module.exports = router;
