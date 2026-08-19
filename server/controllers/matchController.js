const matchService = require('../services/matchService');

async function candidatesForJob(req, res, next) {
  try {
    const [direct, viaColleague] = await Promise.all([
      matchService.matchCandidatesToJob(req.params.jobId),
      matchService.colleagueSkillMatch(req.params.jobId),
    ]);
    res.json({ direct, viaColleague });
  } catch (err) {
    next(err);
  }
}

async function jobsForCandidate(req, res, next) {
  try {
    const jobs = await matchService.recommendJobsForCandidate(req.params.candidateId);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
}

module.exports = { candidatesForJob, jobsForCandidate };
