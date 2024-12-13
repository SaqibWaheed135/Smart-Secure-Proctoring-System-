const express = require('express');
const router = express.Router();
const { createAssessment,getAssessment,deleteAssessment} = require('../controllers/assessmentController');

// Route for creating a Assessment
router.post('/create-assessment', createAssessment);

router.get('/get-assessment', getAssessment);

router.delete('/delete-assessment/:id', deleteAssessment);

module.exports = router;
