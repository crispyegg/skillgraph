const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const matchController = require('../controllers/matchController');

router.get('/', jobController.listJobs);
router.get('/:id', jobController.getJob);
router.post('/', jobController.createJob);

// Nested route: candidates matched to this job (direct + via colleague)
router.get('/:jobId/matches', matchController.candidatesForJob);

module.exports = router;
