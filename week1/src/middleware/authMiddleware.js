/**
 * Authentication Basics Middleware
 * Demonstrates request header inspection and HTTP status code 401 response.
 * Optional protection for sensitive write operations (POST, PUT, DELETE).
 */

function apiKeyAuth(req, res, next) {
  // Allow read operations (GET) without restriction for demo purposes
  if (req.method === 'GET') {
    return next();
  }

  // Check for authorization header or api-key header
  const authHeader = req.headers['authorization'];
  const apiKey = req.headers['x-api-key'];

  // Accept valid key or authorization token from environment (Default demo key: "secret-key-123")
  const expectedKey = process.env.API_KEY || 'secret-key-123';
  if (apiKey === expectedKey || (authHeader && authHeader.startsWith('Bearer demo-token'))) {
    return next();
  }

  return res.status(401).json({
    success: false,
    statusCode: 401,
    error: 'Unauthorized',
    message: 'Missing or invalid API key / Bearer token in headers.',
    hint: 'Pass header `x-api-key: secret-key-123` or `authorization: Bearer demo-token` to mutate resources.'
  });
}

module.exports = { apiKeyAuth };
