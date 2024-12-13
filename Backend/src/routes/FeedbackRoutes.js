const express = require('express');
const router = express.Router();
const { addFeedback, getFeedback } = require('../controllers/FeedbackController');

// Route for adding a candidate
router.post('/add-feedback', addFeedback);

router.get('/get-feedback', getFeedback);


module.exports = router;
