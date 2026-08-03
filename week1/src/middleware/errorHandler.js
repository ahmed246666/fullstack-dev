/**
 * Central Error Handling Middleware & 404 Route Handler
 */

// 404 Handler for undefined routes
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    statusCode: 404,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint does not exist.`
  });
}

// Global Exception Handler
function globalErrorHandler(err, req, res, next) {
  console.error('[Error Handler]:', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    error: err.name || 'ServerError',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
