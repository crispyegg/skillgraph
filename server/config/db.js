const neo4j = require('neo4j-driver');
require('dotenv').config();

const { COGNODB_URI, COGNODB_USER, COGNODB_PASSWORD } = process.env;

if (!COGNODB_URI || !COGNODB_USER || !COGNODB_PASSWORD) {
  console.error(
    '[db] Missing CognoDB connection env vars. Copy .env.example to .env and fill in COGNODB_URI, COGNODB_USER, COGNODB_PASSWORD.'
  );
}

// One driver instance for the whole app's lifetime — it manages a connection
// pool internally, so we do NOT create a new driver per request.
const driver = neo4j.driver(
  COGNODB_URI,
  neo4j.auth.basic(COGNODB_USER, COGNODB_PASSWORD),
  { disableLosslessIntegers: true } // return plain JS numbers instead of Neo4j Integer objects
);

/**
 * Verifies the database is reachable. Called once at server startup so we
 * fail fast with a clear message instead of every request timing out silently.
 */
async function verifyConnectivity() {
  await driver.verifyConnectivity();
  console.log('[db] Connected to CognoDB successfully.');
}

/**
 * Opens a new session for a single unit of work. Callers MUST close the
 * session when done (services below do this in a finally block).
 */
function getSession() {
  return driver.session();
}

async function closeDriver() {
  await driver.close();
}

module.exports = { driver, getSession, verifyConnectivity, closeDriver };
