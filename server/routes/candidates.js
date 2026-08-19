const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

router.get('/', candidateController.listCandidates);
router.get('/:id', candidateController.getCandidate);
router.post('/', candidateController.createCandidate);

module.exports = router;
