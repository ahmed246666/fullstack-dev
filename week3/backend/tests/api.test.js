const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');

process.env.NODE_ENV = 'test';
process.env.DB_FILE = ':memory:';
process.env.PORT = '0';

const app = require('../src/app');

describe('Week 3 Express & SQLite REST API Suite', () => {
  let server;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => {
      if (server) server.close(resolve);
      else resolve();
    });
  });

  test('GET /health returns healthy status', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'healthy');
    assert.ok(data.timestamp);
  });

  test('GET /api/items initially returns empty array with counts', async () => {
    const res = await fetch(`${baseUrl}/api/items`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(typeof body.count, 'number');
    assert.ok(body.counts);
    assert.strictEqual(body.counts.all, 0);
    assert.ok(Array.isArray(body.data));
  });

  test('POST /api/items creates a new item with valid data', async () => {
    const payload = {
      title: 'Implement Next.js App Router',
      description: 'Setup frontend layout and components',
      status: 'pending'
    };

    const res = await fetch(`${baseUrl}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.title, payload.title);
    assert.strictEqual(body.data.description, payload.description);
    assert.strictEqual(body.data.status, 'pending');
    assert.ok(body.data.id);
    assert.ok(body.data.createdAt);
  });

  test('POST /api/items rejects invalid title (< 3 chars)', async () => {
    const payload = { title: 'AB' };

    const res = await fetch(`${baseUrl}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.message, 'Validation Error');
    assert.ok(body.errors.some(e => e.includes('3 characters')));
  });

  test('POST /api/items rejects invalid status', async () => {
    const payload = { title: 'Valid Title', status: 'invalid_status' };

    const res = await fetch(`${baseUrl}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.ok(body.errors.some(e => e.includes('Status must be one of')));
  });

  test('GET /api/items?search= filters correctly on backend', async () => {
    // Create second item
    await fetch(`${baseUrl}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Build SQLite Backend', description: 'SQL prepared statements', status: 'in-progress' })
    });

    const res = await fetch(`${baseUrl}/api/items?search=SQLite`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.length, 1);
    assert.strictEqual(body.data[0].title, 'Build SQLite Backend');
  });

  test('GET /api/items?status= filters correctly by status tab on backend', async () => {
    const res = await fetch(`${baseUrl}/api/items?status=in-progress`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.length, 1);
    assert.strictEqual(body.data[0].status, 'in-progress');
  });

  test('PATCH /api/items/:id/status updates status correctly', async () => {
    const res = await fetch(`${baseUrl}/api/items`);
    const body = await res.json();
    const itemId = body.data[0].id;

    const patchRes = await fetch(`${baseUrl}/api/items/${itemId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    });

    assert.strictEqual(patchRes.status, 200);
    const patchBody = await patchRes.json();
    assert.strictEqual(patchBody.success, true);
    assert.strictEqual(patchBody.data.status, 'completed');
  });

  test('GET /api/unknown returns 404', async () => {
    const res = await fetch(`${baseUrl}/api/unknown_route`);
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });
});
