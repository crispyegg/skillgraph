const { getSession } = require('../config/db');

async function getAllJobs() {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (j:Job)-[:POSTED_BY]->(co:Company)
      OPTIONAL MATCH (j)-[:REQUIRES_SKILL]->(s:Skill)
      RETURN j, co.name AS company, collect(DISTINCT s.name) AS requiredSkills
      ORDER BY j.postedAt DESC
    `);
    return result.records.map((r) => ({
      ...r.get('j').properties,
      company: r.get('company'),
      requiredSkills: r.get('requiredSkills'),
    }));
  } finally {
    await session.close();
  }
}

async function getJobById(id) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (j:Job {id: $id})-[:POSTED_BY]->(co:Company)
      OPTIONAL MATCH (j)-[rs:REQUIRES_SKILL]->(s:Skill)
      RETURN j, co,
             collect(DISTINCT {id: s.id, name: s.name, category: s.category, mandatory: rs.mandatory, weight: rs.weight}) AS requiredSkills
      `,
      { id }
    );

    if (result.records.length === 0) return null;

    const record = result.records[0];
    return {
      ...record.get('j').properties,
      company: record.get('co').properties,
      requiredSkills: record.get('requiredSkills').filter((s) => s.id),
    };
  } finally {
    await session.close();
  }
}

async function createJob({ id, title, description, minExperience, companyId, skillRequirements = [] }) {
  const session = getSession();
  try {
    await session.run(
      `
      MATCH (co:Company {id: $companyId})
      CREATE (j:Job {
        id: $id, title: $title, description: $description,
        minExperience: $minExperience, postedAt: datetime()
      })-[:POSTED_BY]->(co)
      WITH j
      UNWIND $skillRequirements AS req
      MATCH (s:Skill {id: req.skillId})
      MERGE (j)-[:REQUIRES_SKILL {mandatory: req.mandatory, weight: req.weight}]->(s)
      `,
      { id, title, description: description || '', minExperience: minExperience || 0, companyId, skillRequirements }
    );
    return getJobById(id);
  } finally {
    await session.close();
  }
}

module.exports = { getAllJobs, getJobById, createJob };
