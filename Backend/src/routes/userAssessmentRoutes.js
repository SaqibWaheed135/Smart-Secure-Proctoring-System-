const express = require('express');
const router = express.Router();
const { submitQuiz, evaluateQuiz,getEvaluationReport,getQuizAttempts,getQuizAnswers } = require('../controllers/userAssessmentController');

// Route to submit a quiz
router.post('/submit-assessment', submitQuiz);

// Route to get user quiz attempts
router.get('/assessment-attempts/:quiz_id', getQuizAttempts);

// Route to evaluate quiz 
router.post('/evaluate-assessment', evaluateQuiz);

// Route to get evaluation report
router.get('/evaluation-report/:user_id/:quiz_id', getEvaluationReport);

router.get('/quiz-answers/:user_id/:quiz_id', getQuizAnswers);

router.get('/user-assessments/submit-assessment');
router
module.exports = router;
