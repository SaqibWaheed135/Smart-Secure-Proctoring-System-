const express = require('express');
const router = express.Router();
const { submitQuiz, getUserQuizAttempts } = require('../controllers/userAssessmentController');

// Route to submit a quiz
router.post('/submit-assessment', submitQuiz);

// Route to get user quiz attempts
router.get('/user-assessment-attempts/:user_id', getUserQuizAttempts);
module.exports = router;
