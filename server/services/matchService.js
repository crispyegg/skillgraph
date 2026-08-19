const { getSession } = require('../config/db');

// ---------------------------------------------------------------------
// QUERY 1: Multi-hop skill matching (the "2+ hops" requirement)
//
// A job asks for certain skills. Instead of only matching candidates who
// have the EXACT skill, we also look at skills that are "close" on the
// skill graph — connected by 1 or 2 RELATED_TO relationships.
//
// Example: a job requires "React". A candidate who only has "JavaScript"
// still shows up here, because JavaScript is one hop away from React on
// the skill graph (we set that up in the seed data).
// ---------------------------------------------------------------------
async function matchCandidatesToJob(jobId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (job:Job {id: $jobId})-[:REQUIRES_SKILL]->(requiredSkill:Skill)
      MATCH (candidate:Candidate)-[:HAS_SKILL]->(ownedSkill:Skill)
      WHERE ownedSkill = requiredSkill
         OR (ownedSkill)-[:RELATED_TO*1..2]-(requiredSkill)
      WITH candidate, requiredSkill,
           CASE WHEN ownedSkill = requiredSkill THEN 1.0 ELSE 0.5 END AS points
      RETURN candidate.id AS id,
             candidate.name AS name,
             candidate.experienceYears AS experienceYears,
             sum(points) AS matchScore,
             collect(DISTINCT requiredSkill.name) AS matchedOnSkills
      ORDER BY matchScore DESC
      LIMIT 20
      `,
      { jobId }
    );

    // Turn each database record into a plain, simple object.
    const candidates = [];
    for (const record of result.records) {
      candidates.push({
        id: record.get('id'),
        name: record.get('name'),
        experienceYears: record.get('experienceYears'),
        matchScore: record.get('matchScore'),
        matchedOnSkills: record.get('matchedOnSkills'),
      });
    }
    return candidates;
  } finally {
    await session.close();
  }
}

// ---------------------------------------------------------------------
// QUERY 2: Colleague-network matching (the "awkward in SQL" requirement)
//
// Sometimes a candidate doesn't have a required skill themselves, but a
// PAST COLLEAGUE of theirs does (they worked on the same Project together).
// That's still a useful signal — they may be able to learn from that
// colleague or the team already trusts them.
//
// This kind of "find a friend of a friend who has X" query needs several
// self-joins in SQL. In Cypher it's one readable pattern.
// ---------------------------------------------------------------------
async function colleagueSkillMatch(jobId) {
  const session = getSession();
  try {
    // Step 1: find candidate/colleague/skill triples via shared projects.
    // (No "already has it" exclusion here — that part moved to JS below,
    // because WHERE NOT (pattern) was unreliable on this CognoDB instance.)
    const colleagueResult = await session.run(
      `
      MATCH (job:Job {id: $jobId})-[:REQUIRES_SKILL]->(requiredSkill:Skill)
      MATCH (candidate:Candidate)-[:WORKED_ON]->(project:Project)<-[:WORKED_ON]-(colleague:Candidate)
      MATCH (colleague)-[:HAS_SKILL]->(requiredSkill)
      WHERE candidate <> colleague
      RETURN DISTINCT
             candidate.id AS candidateId,
             candidate.name AS candidateName,
             colleague.name AS colleagueName,
             project.name AS projectName,
             requiredSkill.id AS skillId,
             requiredSkill.name AS skillName
      `,
      { jobId }
    );

    // Step 2: fetch every candidate's own skills, so we know what to exclude.
    const ownedSkillsResult = await session.run(
      `MATCH (c:Candidate)-[:HAS_SKILL]->(s:Skill) RETURN c.id AS candidateId, s.id AS skillId`
    );

    // Build a fast lookup: "candidateId|skillId" -> true, for exclusion checks.
    const ownedSkillLookup = new Set();
    for (const record of ownedSkillsResult.records) {
      const key = record.get('candidateId') + '|' + record.get('skillId');
      ownedSkillLookup.add(key);
    }

    // Step 3: keep only rows where the candidate does NOT already own the skill.
    const matches = [];
    for (const record of colleagueResult.records) {
      const candidateId = record.get('candidateId');
      const skillId = record.get('skillId');
      const candidateAlreadyHasIt = ownedSkillLookup.has(candidateId + '|' + skillId);

      if (!candidateAlreadyHasIt) {
        matches.push({
          id: candidateId,
          name: record.get('candidateName'),
          viaColleague: record.get('colleagueName'),
          sharedProject: record.get('projectName'),
          missingSkill: record.get('skillName'),
        });
      }
    }

    return matches.slice(0, 20);
  } finally {
    await session.close();
  }
}

// ---------------------------------------------------------------------
// QUERY 3: Job recommendations for a candidate (reverse direction)
//
// Given one candidate, rank all jobs by what percentage of the job's
// required skills the candidate already has.
// ---------------------------------------------------------------------
async function recommendJobsForCandidate(candidateId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (candidate:Candidate {id: $candidateId})-[:HAS_SKILL]->(skill:Skill)
      MATCH (job:Job)-[:REQUIRES_SKILL]->(skill)
      WITH job, count(DISTINCT skill) AS skillsCandidateHas
      MATCH (job)-[:REQUIRES_SKILL]->(anySkill:Skill)
      WITH job, skillsCandidateHas, count(DISTINCT anySkill) AS totalSkillsNeeded
      RETURN job.id AS id,
             job.title AS title,
             skillsCandidateHas AS overlap,
             totalSkillsNeeded AS total,
             round(100.0 * skillsCandidateHas / totalSkillsNeeded) AS matchPercent
      ORDER BY matchPercent DESC
      LIMIT 10
      `,
      { candidateId }
    );

    const jobs = [];
    for (const record of result.records) {
      jobs.push({
        id: record.get('id'),
        title: record.get('title'),
        overlap: record.get('overlap'),
        total: record.get('total'),
        matchPercent: record.get('matchPercent'),
      });
    }
    return jobs;
  } finally {
    await session.close();
  }
}

module.exports = { matchCandidatesToJob, colleagueSkillMatch, recommendJobsForCandidate };
