# SkillGraph — Skill-Based Job & Candidate Matching Platform

A full-stack MERN-style application (Express + React) backed by **CognoDB**, a managed graph database, used through the official **neo4j-driver** (CognoDB speaks openCypher over Bolt, so it works with standard Neo4j tooling).

## Live Demo

- **Live app:** https://skillgraph-dl6yy4ptm-asifs-projects-5c171bd3.vercel.app/jobs
- **Backend API:** https://skillgraph-ir7d.onrender.com
- **GitHub repo:** [YOUR GITHUB REPO URL HERE]

> Note: the backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle may take 30–50 seconds to respond — please wait for it to wake up.

## Why a graph database?

Job matching is fundamentally a network problem, not a table problem:

- **Skills relate to other skills** (React → JavaScript → TypeScript). A relational schema would need a separate `skill_relations` join table plus recursive CTEs to answer "find candidates whose skills are within 2 steps of what this job requires." In Cypher this is one pattern: `(candidate)-[:HAS_SKILL]->(:Skill)-[:RELATED_TO*1..2]-(required:Skill)`.
- **People relate through shared history.** "Find candidates connected to someone who has a required skill, via a shared past project" is a multi-table self-join nightmare in SQL (`candidates JOIN project_members JOIN project_members JOIN candidates JOIN skills...`) but a three-hop graph pattern here.
- The interesting queries are entirely about *connections*, not aggregates over rows — that's exactly where graph databases earn their place over relational ones.

## Data model

**Nodes**
| Label | Properties |
|---|---|
| `Candidate` | id, name, email, bio, experienceYears |
| `Skill` | id, name, category |
| `Company` | id, name, industry |
| `Job` | id, title, description, minExperience, postedAt |
| `Project` | id, name |

**Relationships**
| Relationship | Direction | Properties |
|---|---|---|
| `HAS_SKILL` | Candidate → Skill | proficiency, yearsUsed |
| `REQUIRES_SKILL` | Job → Skill | mandatory, weight |
| `RELATED_TO` | Skill — Skill | strength |
| `WORKED_AT` | Candidate → Company | role, from, to |
| `POSTED_BY` | Job → Company | — |
| `WORKED_ON` | Candidate → Project | — |


## Setup

### 1. Create your CognoDB instance
1. Sign up at https://console.cognodb.com/signup (free, no card).
2. Create a free `c0` instance, pick a region.
3. Copy the `bolt+s://...` URI and the generated password for user `cognodb` — shown once.

### 2. Backend
```bash
cd server
cp .env.example .env   # fill in COGNODB_URI and COGNODB_PASSWORD
npm install
npm run seed            # loads seed data into the graph
npm run dev              # starts API on http://localhost:5000
```

### 3. Frontend
```bash
cd client
npm install
npm run dev               # starts React app on http://localhost:5173
```

## Main queries (see `server/services/`)

- **Multi-hop skill match** (`matchService.js` → `matchCandidatesToJob`): finds candidates whose skills reach a job's required skills within 2 `RELATED_TO` hops, scored by match count.
- **Colleague-network match** (`matchService.js` → `colleagueSkillMatch`): finds candidates who don't have a required skill directly, but worked on a shared project with someone who does — the query relational databases handle awkwardly.
- **Job recommendations for a candidate** (`matchService.js` → `recommendJobsForCandidate`): ranks jobs by percentage of required skills the candidate already has.

All queries use parameterised Cypher via the driver (`session.run(query, params)`) — no string concatenation.

### A note on the colleague-match query

The colleague-network match originally tried to exclude candidates who already have a skill using Cypher's `WHERE NOT (pattern)`. This construct behaved unreliably on this CognoDB instance during testing — the graph traversal itself worked correctly, but the negated pattern exclusion did not return expected results.

The fix: the multi-hop graph traversal (finding candidates connected through shared projects) stays in Cypher, since that's the part that genuinely needs a graph query. The final exclusion check ("does this candidate already have the skill?") was moved into application code using a simple `Set` lookup, which is easy to verify and debug.

## Project structure

## Project structure

skillgraph/
├── server/ # Express API
│ ├── config/db.js # neo4j-driver connection, read from env
│ ├── controllers/ # request/response handling
│ ├── services/ # Cypher queries live here
│ ├── routes/
│ ├── middleware/errorHandler.js
│ ├── scripts/seed.js + seedData.js
│ └── server.js
└── client/ # React (Vite) + Tailwind
└── src/
├── api/client.js
├── components/
└── pages/
```

## Error handling

If CognoDB is unreachable, the API returns a `503` with a clear message instead of crashing (see `middleware/errorHandler.js` and the try/catch + connectivity check in `config/db.js`). The frontend shows a dedicated error state rather than a blank screen.

## Screenshots / Demo

_Add screenshots and hosted demo link here before submission._
