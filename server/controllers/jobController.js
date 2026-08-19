const crypto = require('crypto');
const jobService = require('../services/jobService');

// GET /api/jobs
async function listJobs(req, res, next) {
  try {
    const jobs = await jobService.getAllJobs();
    res.json(jobs);
  } catch (error) {
    next(error); // hand off to the error-handling middleware in server.js
  }
}

// GET /api/jobs/:id
async function getJob(req, res, next) {
  try {
    const jobId = req.params.id;
    const job = await jobService.getJobById(jobId);

    if (!job) {
      res.status(404).json({ error: 'not_found', message: 'Job not found.' });
      return;
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
}

// POST /api/jobs
async function createJob(req, res, next) {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const minExperience = req.body.minExperience;
    const companyId = req.body.companyId;
    const skillRequirements = req.body.skillRequirements;

    // Basic validation before we touch the database
    if (!title || !companyId) {
      res.status(400).json({
        error: 'validation_error',
        message: 'title and companyId are required.',
      });
      return;
    }

    const newJobId = 'j_' + crypto.randomUUID();

    const createdJob = await jobService.createJob({
      id: newJobId,
      title,
      description,
      minExperience,
      companyId,
      skillRequirements,
    });

    res.status(201).json(createdJob);
  } catch (error) {
    next(error);
  }
}

module.exports = { listJobs, getJob, createJob };
