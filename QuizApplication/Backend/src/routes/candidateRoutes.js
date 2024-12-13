const express = require('express');
const router = express.Router();
const { addCandidates,getCandidates,deleteCandidate } = require('../controllers/candidateController');

// Route for adding a candidate
router.post('/add-candidate', addCandidates);

router.get('/get-candidates', getCandidates);

router.delete('/delete-candidates/:id', deleteCandidate);

module.exports = router;
