const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Jobs recommended for a given candidate
router.get('/candidates/:candidateId/jobs', matchController.jobsForCandidate);

module.exports = router;
