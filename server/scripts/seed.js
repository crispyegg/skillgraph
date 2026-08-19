require('dotenv').config();
const { getSession, closeDriver, verifyConnectivity } = require('../config/db');
const seedData = require('./seedData');

// -----------------------------------------------------------------------
// This script fills an empty CognoDB database with sample data so the
// app has something to show. Run it with: npm run seed
//
// It does 6 things, in order:
//   1. Delete anything already in the database (so re-running is safe)
//   2. Create Skill nodes
//   3. Connect skills to each other (RELATED_TO)
//   4. Create Company nodes
//   5. Create Project nodes
//   6. Create Job nodes, connected to their Company and required Skills
//   7. Create Candidate nodes, connected to their Skills, Companies, Projects
// -----------------------------------------------------------------------

async function deleteEverything(session) {
  console.log('[seed] Step 1: Clearing existing data...');
  await session.run('MATCH (n) DETACH DELETE n');
}

async function createSkills(session) {
  console.log('[seed] Step 2: Creating ' + seedData.skills.length + ' skills...');
  for (const skill of seedData.skills) {
    await session.run(
      'CREATE (s:Skill {id: $id, name: $name, category: $category})',
      { id: skill.id, name: skill.name, category: skill.category }
    );
  }
}

async function createSkillRelationships(session) {
  console.log('[seed] Step 3: Connecting ' + seedData.skillRelations.length + ' related skills...');
  for (const relation of seedData.skillRelations) {
    const fromSkillId = relation[0];
    const toSkillId = relation[1];
    const strength = relation[2];

    await session.run(
      `
      MATCH (skillA:Skill {id: $fromSkillId}), (skillB:Skill {id: $toSkillId})
      MERGE (skillA)-[:RELATED_TO {strength: $strength}]-(skillB)
      `,
      { fromSkillId, toSkillId, strength }
    );
  }
}

async function createCompanies(session) {
  console.log('[seed] Step 4: Creating ' + seedData.companies.length + ' companies...');
  for (const company of seedData.companies) {
    await session.run(
      'CREATE (c:Company {id: $id, name: $name, industry: $industry})',
      { id: company.id, name: company.name, industry: company.industry }
    );
  }
}

async function createProjects(session) {
  console.log('[seed] Step 5: Creating ' + seedData.projects.length + ' projects...');
  for (const project of seedData.projects) {
    await session.run(
      'CREATE (p:Project {id: $id, name: $name})',
      { id: project.id, name: project.name }
    );
  }
}

async function createJobs(session) {
  console.log('[seed] Step 6: Creating ' + seedData.jobs.length + ' jobs...');
  for (const job of seedData.jobs) {
    // First create the Job node itself, linked to its Company
    await session.run(
      `
      MATCH (company:Company {id: $companyId})
      CREATE (job:Job {
        id: $id,
        title: $title,
        description: $description,
        minExperience: $minExperience,
        postedAt: datetime()
      })-[:POSTED_BY]->(company)
      `,
      {
        id: job.id,
        title: job.title,
        description: job.description,
        minExperience: job.minExperience,
        companyId: job.companyId,
      }
    );

    // Then connect it to every skill it requires
    for (const requirement of job.skillRequirements) {
      await session.run(
        `
        MATCH (job:Job {id: $jobId}), (skill:Skill {id: $skillId})
        MERGE (job)-[:REQUIRES_SKILL {mandatory: $mandatory, weight: $weight}]->(skill)
        `,
        {
          jobId: job.id,
          skillId: requirement.skillId,
          mandatory: requirement.mandatory,
          weight: requirement.weight,
        }
      );
    }
  }
}

async function createCandidates(session) {
  console.log('[seed] Step 7: Creating ' + seedData.candidates.length + ' candidates...');
  for (const candidate of seedData.candidates) {
    // First create the Candidate node itself
    await session.run(
      `
      CREATE (c:Candidate {
        id: $id,
        name: $name,
        email: $email,
        bio: $bio,
        experienceYears: $experienceYears
      })
      `,
      {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        bio: candidate.bio,
        experienceYears: candidate.experienceYears,
      }
    );

    // Then connect them to each skill they have
    for (const skill of candidate.skills) {
      await session.run(
        `
        MATCH (candidate:Candidate {id: $candidateId}), (skill:Skill {id: $skillId})
        MERGE (candidate)-[:HAS_SKILL {proficiency: $proficiency, yearsUsed: $yearsUsed}]->(skill)
        `,
        {
          candidateId: candidate.id,
          skillId: skill.skillId,
          proficiency: skill.proficiency,
          yearsUsed: skill.yearsUsed,
        }
      );
    }

    // Then connect them to their past companies
    for (const job of candidate.workHistory) {
      await session.run(
        `
        MATCH (candidate:Candidate {id: $candidateId}), (company:Company {id: $companyId})
        MERGE (candidate)-[:WORKED_AT {role: $role, from: $from, to: $to}]->(company)
        `,
        {
          candidateId: candidate.id,
          companyId: job.companyId,
          role: job.role,
          from: job.from,
          to: job.to,
        }
      );
    }

    // Then connect them to any shared projects (used for colleague matching)
    for (const projectId of candidate.projectIds) {
      await session.run(
        `
        MATCH (candidate:Candidate {id: $candidateId}), (project:Project {id: $projectId})
        MERGE (candidate)-[:WORKED_ON]->(project)
        `,
        { candidateId: candidate.id, projectId }
      );
    }
  }
}

async function runSeedScript() {
  // Step 0: make sure we can actually reach CognoDB before doing anything
  try {
    await verifyConnectivity();
  } catch (error) {
    console.error('[seed] Could not connect to CognoDB. Check your .env file.');
    console.error(error.message);
    process.exit(1);
  }

  const session = getSession();
  try {
    await deleteEverything(session);
    await createSkills(session);
    await createSkillRelationships(session);
    await createCompanies(session);
    await createProjects(session);
    await createJobs(session);
    await createCandidates(session);
    console.log('[seed] Done! Database seeded successfully.');
  } catch (error) {
    console.error('[seed] Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await session.close();
    await closeDriver();
  }
}

runSeedScript();
