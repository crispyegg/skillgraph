require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { verifyConnectivity } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const candidateRoutes = require('./routes/candidates');
const jobRoutes = require('./routes/jobs');
const matchRoutes = require('./routes/matches');

const app = express();

// Which port to run on. Falls back to 5000 if PORT isn't set in .env
let port = process.env.PORT;
if (!port) {
  port = 5000;
}

// Which frontend URL is allowed to call this API (CORS).
// Falls back to the local Vite dev server address.
let clientOrigin = process.env.CLIENT_ORIGIN;
if (!clientOrigin) {
  clientOrigin = 'http://localhost:5173';
}

// --- Middleware setup ---
app.use(cors({ origin: clientOrigin }));
app.use(express.json()); // lets us read JSON bodies from POST requests

// --- A simple health check route, useful for confirming the API is up ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- Feature routes ---
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/matches', matchRoutes);

// --- If nothing above matched the request, return a plain 404 ---
app.use((req, res) => {
  res.status(404).json({ error: 'not_found', message: 'Route not found.' });
});

// --- Central error handler. Must be registered LAST. ---
app.use(errorHandler);

// --- Start the server ---
async function startServer() {
  // Try connecting to CognoDB once at startup, so we see a clear error
  // message immediately if the .env credentials are wrong, instead of
  // every single request failing silently later.
  try {
    await verifyConnectivity();
  } catch (error) {
    console.error('[server] Could not connect to CognoDB at startup:', error.message);
    console.error('[server] Check COGNODB_URI / COGNODB_USER / COGNODB_PASSWORD in your .env file.');
    // We still start the server below, so /api/health works even if the
    // database is down. Other routes will return a 503 via errorHandler.
  }

  app.listen(port, () => {
    console.log('[server] SkillGraph API running on http://localhost:' + port);
  });
}

startServer();
