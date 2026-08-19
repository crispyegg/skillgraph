const crypto = require('crypto');
const candidateService = require('../services/candidateService');

// GET /api/candidates
async function listCandidates(req, res, next) {
  try {
    const candidates = await candidateService.getAllCandidates();
    res.json(candidates);
  } catch (error) {
    next(error); // hand off to the error-handling middleware in server.js
  }
}

// GET /api/candidates/:id
async function getCandidate(req, res, next) {
  try {
    const candidateId = req.params.id;
    const candidate = await candidateService.getCandidateById(candidateId);

    if (!candidate) {
      res.status(404).json({ error: 'not_found', message: 'Candidate not found.' });
      return;
    }

    res.json(candidate);
  } catch (error) {
    next(error);
  }
}

// POST /api/candidates
async function createCandidate(req, res, next) {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const bio = req.body.bio;
    const experienceYears = req.body.experienceYears;
    const skillIds = req.body.skillIds;

    // Basic validation before we touch the database
    if (!name || !email) {
      res.status(400).json({
        error: 'validation_error',
        message: 'name and email are required.',
      });
      return;
    }

    const newCandidateId = 'c_' + crypto.randomUUID();

    const createdCandidate = await candidateService.createCandidate({
      id: newCandidateId,
      name,
      email,
      bio,
      experienceYears,
      skillIds,
    });

    res.status(201).json(createdCandidate);
  } catch (error) {
    next(error);
  }
}

module.exports = { listCandidates, getCandidate, createCandidate };
