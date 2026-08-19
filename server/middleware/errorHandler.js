/**
 * Central error handler. Distinguishes "database unreachable" errors from
 * regular application errors so the client can show the right UI state.
 */
function errorHandler(err, req, res, next) {
  console.error('[error]', err.message);

  const isDbConnectivityError =
    err.code === 'ServiceUnavailable' ||
    err.code === 'Neo.ClientError.Security.Unauthorized' ||
    /ECONNREFUSED|ENOTFOUND|connect/i.test(err.message || '');

  if (isDbConnectivityError) {
    return res.status(503).json({
      error: 'database_unreachable',
      message: 'The graph database is currently unreachable. Please try again shortly.',
    });
  }

  res.status(err.status || 500).json({
    error: 'internal_error',
    message: err.message || 'Something went wrong.',
  });
}

module.exports = errorHandler;
