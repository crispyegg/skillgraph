const { getSession } = require('../config/db');

/**
 * Returns all candidates with a summary of their skills.
 */
async function getAllCandidates() {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (c:Candidate)
      OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
      RETURN c, collect(DISTINCT s.name) AS skills
      ORDER BY c.name
    `);
    return result.records.map((r) => ({
      ...r.get('c').properties,
      skills: r.get('skills'),
    }));
  } finally {
    await session.close();
  }
}

/**
 * Returns a single candidate with full skill details, work history, and projects.
 */
async function getCandidateById(id) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (c:Candidate {id: $id})
      OPTIONAL MATCH (c)-[hs:HAS_SKILL]->(s:Skill)
      OPTIONAL MATCH (c)-[wa:WORKED_AT]->(co:Company)
      OPTIONAL MATCH (c)-[:WORKED_ON]->(p:Project)
      RETURN c,
             collect(DISTINCT {skill: s.name, category: s.category, proficiency: hs.proficiency, yearsUsed: hs.yearsUsed}) AS skills,
             collect(DISTINCT {company: co.name, role: wa.role, from: wa.from, to: wa.to}) AS workHistory,
             collect(DISTINCT p.name) AS projects
      `,
      { id }
    );

    if (result.records.length === 0) return null;

    const record = result.records[0];
    return {
      ...record.get('c').properties,
      skills: record.get('skills').filter((s) => s.skill),
      workHistory: record.get('workHistory').filter((w) => w.company),
      projects: record.get('projects').filter(Boolean),
    };
  } finally {
    await session.close();
  }
}

/**
 * Creates a candidate node and links their skills, company, and projects.
 * skillIds, companyId, and projectIds are expected to already exist.
 */
async function createCandidate({ id, name, email, bio, experienceYears, skillIds = [] }) {
  const session = getSession();
  try {
    await session.run(
      `
      CREATE (c:Candidate {
        id: $id, name: $name, email: $email,
        bio: $bio, experienceYears: $experienceYears
      })
      WITH c
      UNWIND $skillIds AS skillId
      MATCH (s:Skill {id: skillId})
      MERGE (c)-[:HAS_SKILL {proficiency: 'intermediate', yearsUsed: 1}]->(s)
      `,
      { id, name, email, bio: bio || '', experienceYears: experienceYears || 0, skillIds }
    );
    return getCandidateById(id);
  } finally {
    await session.close();
  }
}

module.exports = { getAllCandidates, getCandidateById, createCandidate };
