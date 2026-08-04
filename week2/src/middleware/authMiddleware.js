/**
 * Authentication Middleware - Week 2
 * Header inspection & API Key validation
 */

function apiKeyAuth(req, res, next) {
  // Allow read operations (GET) without restriction for demo purposes
  if (req.method === 'GET') {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const apiKey = req.headers['x-api-key'];

  const expectedKey = process.env.API_KEY || 'secret-key-week2';

  if (apiKey === expectedKey || (authHeader && authHeader.startsWith('Bearer demo-token'))) {
    return next();
  }

  return res.status(401).json({
    success: false,
    statusCode: 401,
    error: 'Unauthorized',
    message: 'Missing or invalid API key / Bearer token in headers.',
    hint: 'Pass header `x-api-key: secret-key-week2` or `authorization: Bearer demo-token` to mutate resources.'
  });
}

module.exports = { apiKeyAuth };
