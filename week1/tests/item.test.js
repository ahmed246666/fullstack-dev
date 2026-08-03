/**
 * Automated Test Suite for Week 1 REST API Exercise
 * Uses Node.js native test runner (node:test & node:assert)
 */

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../src/app');

describe('Week 1 Node.js Express REST API Tests', () => {
  let server;
  let port;
  const authHeader = { 'x-api-key': 'secret-key-123', 'Content-Type': 'application/json' };

  // Helper function to make HTTP requests during tests
  function request(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const payload = body ? JSON.stringify(body) : '';
      const reqHeaders = {
        'Content-Type': 'application/json',
        ...headers
      };

      if (body) {
        reqHeaders['Content-Length'] = Buffer.byteLength(payload);
      }

      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: port,
          path: path,
          method: method,
          headers: reqHeaders
        },
        res => {
          let data = '';
          res.on('data', chunk => (data += chunk));
          res.on('end', () => {
            try {
              const json = data ? JSON.parse(data) : {};
              resolve({ status: res.statusCode, body: json });
            } catch (err) {
              resolve({ status: res.statusCode, text: data });
            }
          });
        }
      );

      req.on('error', reject);
      if (body) req.write(payload);
      req.end();
    });
  }

  before(async () => {
    await new Promise(resolve => {
      server = app.listen(0, '127.0.0.1', resolve);
    });
    port = server.address().port;
  });

  after(async () => {
    await new Promise(resolve => {
      server.close(resolve);
    });
  });

  it('GET /health - Should return HTTP 200 with status UP', async () => {
    const res = await request('GET', '/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'UP');
    assert.strictEqual(res.body.week, 1);
  });

  it('GET /api/items - Should return HTTP 200 and list of items', async () => {
    const res = await request('GET', '/api/items');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(Array.isArray(res.body.data), true);
    assert.strictEqual(res.body.data.length >= 3, true);
  });

  it('GET /api/items/1 - Should return HTTP 200 for existing item', async () => {
    const res = await request('GET', '/api/items/1');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.id, 1);
  });

  it('GET /api/items/999 - Should return HTTP 404 for non-existing item', async () => {
    const res = await request('GET', '/api/items/999');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error, 'Not Found');
  });

  it('POST /api/items - Should return HTTP 401 Unauthorized if missing auth header', async () => {
    const res = await request('POST', '/api/items', {
      title: 'Unauthorized Item',
      category: 'Test'
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('POST /api/items - Should return HTTP 400 Bad Request for invalid payload', async () => {
    const res = await request('POST', '/api/items', { title: '' }, authHeader);
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error, 'Bad Request');
  });

  it('POST /api/items - Should return HTTP 201 Created for valid item', async () => {
    const newItem = {
      title: 'Automated Test Item',
      category: 'Testing',
      description: 'Item created via automated test runner',
      status: 'planned'
    };

    const res = await request('POST', '/api/items', newItem, authHeader);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.title, 'Automated Test Item');
    assert.strictEqual(typeof res.body.data.id, 'number');
  });

  it('PUT /api/items/1 - Should return HTTP 200 and updated item', async () => {
    const updatePayload = {
      title: 'Updated REST API Guide Title',
      status: 'completed'
    };

    const res = await request('PUT', '/api/items/1', updatePayload, authHeader);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.title, 'Updated REST API Guide Title');
  });

  it('DELETE /api/items/2 - Should return HTTP 200 on successful deletion', async () => {
    const res = await request('DELETE', '/api/items/2', null, authHeader);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    // Verify item 2 no longer exists
    const checkRes = await request('GET', '/api/items/2');
    assert.strictEqual(checkRes.status, 404);
  });
});
