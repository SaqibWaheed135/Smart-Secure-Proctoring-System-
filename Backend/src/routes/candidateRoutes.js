const express = require('express');
const router = express.Router();
const { addCandidates,getCandidates,deleteCandidate,sendRegistrationEmail,CandidateLogin,createClassroom,candidateLoginWithClassroom} = require('../controllers/candidateController');
const Candidate = require('../models/Candidate');

// Route for adding a candidate
router.post('/add-candidate', addCandidates);

router.get('/get-candidates', getCandidates);

router.delete('/delete-candidates/:id', deleteCandidate);

// Route for validating the token
//router.get('/validate-token', validateToken);

// Route for candidate registration
//router.post('/register', completeRegistration);

router.post('/send-invite',sendRegistrationEmail);

router.post('/login-candidate',CandidateLogin);

router.post('/create-classroom',createClassroom);

router.post('/candidate-login-with-classroom',candidateLoginWithClassroom);

module.exports = router;
