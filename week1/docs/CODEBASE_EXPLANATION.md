# Codebase Deep Dive & Execution Guide

This document provides a line-by-line breakdown of every file in the Week 1 Node.js Express REST API project, instructions on how to run and test it, and an overview of missing features required for full production readiness.

---

# 📄 File-by-File & Line-by-Line Breakdown

---

## 1. [src/server.js](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/week1/src/server.js) — HTTP Server Entry Point

This file initializes and starts the HTTP server listener.

```javascript
1:  /**
2:   * HTTP Server Entry Point
3:   */
4: 
5:  require('dotenv').config();
6:  const app = require('./app');
7: 
8:  const PORT = process.env.PORT || 3000;
9: 
10: app.listen(PORT, () => {
11:   console.log(`=================================================`);
12:   console.log(` Week 1 Node.js REST API Running`);
13:   console.log(` Environment : ${process.env.NODE_ENV || 'development'}`);
14:   console.log(` Server URL  : http://localhost:${PORT}`);
15:   console.log(` Health Check: http://localhost:${PORT}/health`);
16:   console.log(` Items API   : http://localhost:${PORT}/api/items`);
17:   console.log(`=================================================`);
18: });
```

### Line-by-Line Explanation:
* **Line 5 (`require('dotenv').config();`)**: Loads environment variables from a `.env` file into `process.env`.
* **Line 6 (`const app = require('./app');`)**: Imports the configured Express application instance from `app.js`.
* **Line 8 (`const PORT = process.env.PORT || 3000;`)**: Sets the listening port to `process.env.PORT` if defined, or defaults to port `3000`.
* **Lines 10–18 (`app.listen(...)`)**: Starts the HTTP server on `PORT` and logs a confirmation block with available endpoint URLs.

---

## 2. [src/app.js](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/week1/src/app.js) — Express Application Setup

Configures global middleware, health check endpoint, resource routes, and error handlers.

```javascript
1:  /**
2:   * Express Application Setup
3:   * Configures middleware, routes, and global error handling.
4:   */
5: 
6:  const express = require('express');
7:  const cors = require('cors');
8:  const itemRoutes = require('./routes/itemRoutes');
9:  const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');
10: 
11: const app = express();
12: 
13: // Basic Middleware
14: app.use(cors());
15: app.use(express.json());
16: app.use(express.urlencoded({ extended: true }));
17: 
18: // Request logger middleware
19: app.use((req, res, next) => {
20:   const timestamp = new Date().toISOString();
21:   console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
22:   next();
23: });
24: 
25: // Health check endpoint
26: app.get('/health', (req, res) => {
27:   res.status(200).json({
28:     status: 'UP',
29:     program: 'Enterprise Full-Stack Development Program',
30:     week: 1,
31:     developer: 'Ahmed Osama Ezzat Ahmed Hamed',
32:     timestamp: new Date().toISOString()
33:   });
34: });
35: 
36: // API Routes
37: app.use('/api/items', itemRoutes);
38: 
39: // Handling 404 & Global Errors
40: app.use(notFoundHandler);
41: app.use(globalErrorHandler);
42: 
43: module.exports = app;
```

### Line-by-Line Explanation:
* **Lines 6–9**: Imports Express, CORS middleware, item router, and custom error middleware.
* **Line 11 (`const app = express();`)**: Creates an instance of Express application.
* **Line 14 (`app.use(cors());`)**: Enables Cross-Origin Resource Sharing for front-end access.
* **Line 15 (`app.use(express.json());`)**: Parses incoming request bodies containing JSON data into `req.body`.
* **Line 16 (`app.use(express.urlencoded({ extended: true }));`)**: Parses URL-encoded data from HTML forms.
* **Lines 19–23**: Custom logging middleware that prints timestamped HTTP method and URL for every request, then passes control to `next()`.
* **Lines 26–34**: `GET /health` endpoint returning server status `UP` (`200 OK`) and developer metadata.
* **Line 37 (`app.use('/api/items', itemRoutes);`)**: Mounts the item router onto `/api/items`.
* **Line 40 (`app.use(notFoundHandler);`)**: Catches requests to any endpoint that doesn't exist (`404 Not Found`).
* **Line 41 (`app.use(globalErrorHandler);`)**: Central error handler that catches unhandled errors (`500 Server Error`).
* **Line 43 (`module.exports = app;`)**: Exports `app` for testing and server execution.

---

## 3. [src/routes/itemRoutes.js](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/week1/src/routes/itemRoutes.js) — API Router

Maps URL paths and HTTP verbs to controller actions.

```javascript
1:  /**
2:   * Item Routes
3:   * Endpoint mapping for /api/items resource
4:   */
5: 
6:  const express = require('express');
7:  const router = express.Router();
8:  const itemController = require('../controllers/itemController');
9:  const { apiKeyAuth } = require('../middleware/authMiddleware');
10: 
11: // Apply auth middleware for demonstration
12: router.use(apiKeyAuth);
13: 
14: // Define CRUD routes
15: router.get('/', itemController.getItems);
16: router.get('/:id', itemController.getItemById);
17: router.post('/', itemController.createItem);
18: router.put('/:id', itemController.updateItem);
19: router.delete('/:id', itemController.deleteItem);
20: 
21: module.exports = router;
```

### Line-by-Line Explanation:
* **Line 7 (`const router = express.Router();`)**: Creates an Express router instance.
* **Line 12 (`router.use(apiKeyAuth);`)**: Applies API key authentication check across item endpoints.
* **Line 15 (`router.get('/', ...)`)**: Maps `GET /api/items` to `getItems` controller.
* **Line 16 (`router.get('/:id', ...)`)**: Maps `GET /api/items/:id` to `getItemById` controller.
* **Line 17 (`router.post('/', ...)`)**: Maps `POST /api/items` to `createItem` controller.
* **Line 18 (`router.put('/:id', ...)`)**: Maps `PUT /api/items/:id` to `updateItem` controller.
* **Line 19 (`router.delete('/:id', ...)`)**: Maps `DELETE /api/items/:id` to `deleteItem` controller.
* **Line 21**: Exports `router`.

---

## 4. [src/middleware/authMiddleware.js](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/week1/src/middleware/authMiddleware.js) — Auth Middleware

Demonstrates header inspection and `401 Unauthorized` responses.

```javascript
7:  function apiKeyAuth(req, res, next) {
8:    // Allow read operations (GET) without restriction for demo purposes
9:    if (req.method === 'GET') {
10:     return next();
11:   }
12: 
13:   // Check for authorization header or api-key header
14:   const authHeader = req.headers['authorization'];
15:   const apiKey = req.headers['x-api-key'];
16: 
17:   // Accept valid key or authorization token (Default demo key: "secret-key-123")
18:   if (apiKey === 'secret-key-123' || (authHeader && authHeader.startsWith('Bearer demo-token'))) {
19:     return next();
20:   }
21: 
22:   return res.status(401).json({
23:     success: false,
24:     statusCode: 401,
25:     error: 'Unauthorized',
26:     message: 'Missing or invalid API key / Bearer token in headers.',
27:     hint: 'Pass header `x-api-key: secret-key-123` or `authorization: Bearer demo-token` to mutate resources.'
28:   });
29: }
```

### Line-by-Line Explanation:
* **Lines 9–11**: If request method is `GET`, allows access without authentication header.
* **Lines 14–15**: Reads `authorization` and `x-api-key` headers from incoming request.
* **Lines 18–20**: Validates key (`secret-key-123` or `Bearer demo-token`); if valid, calls `next()` to proceed.
* **Lines 22–28**: If key is missing or invalid, immediately stops execution and returns `401 Unauthorized` JSON response.

---

## 5. [src/middleware/errorHandler.js](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/week1/src/middleware/errorHandler.js) — Error Handler

```javascript
6:  function notFoundHandler(req, res, next) {
7:    res.status(404).json({
8:      success: false,
9:      statusCode: 404,
10:     error: 'Not Found',
11:     message: `Cannot ${req.method} ${req.originalUrl} - Endpoint does not exist.`
12:   });
13: }
14: 
16: function globalErrorHandler(err, req, res, next) {
17:   console.error('[Error Handler]:', err.stack || err.message);
18: 
19:   const statusCode = err.statusCode || 500;
20:   const message = err.message || 'Internal Server Error';
21: 
22:   res.status(statusCode).json({
23:     success: false,
24:     statusCode,
25:     error: err.name || 'ServerError',
26:     message,
27:     ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
28:   });
29: }
```

### Line-by-Line Explanation:
* **Lines 6–13 (`notFoundHandler`)**: Executed when no route matches the URL. Returns `404 Not Found`.
* **Lines 16–29 (`globalErrorHandler`)**: Express 4-parameter error handler `(err, req, res, next)`. Logs error stack and returns standardized `500 Internal Server Error` (or custom status code).

---

## 6. [src/controllers/itemController.js](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/week1/src/controllers/itemController.js) — Controller Layer

Handles request parameters, runs input validation, calls service layer, and returns JSON responses.

* **`getItems(req, res, next)`**: Extracts query filters (`category`, `status`), fetches filtered items from `itemService`, returns `200 OK`.
* **`getItemById(req, res, next)`**: Extracts `id` parameter, checks if item exists, returns `200 OK` or `404 Not Found`.
* **`createItem(req, res, next)`**: Validates `title` and `category` fields. Returns `400 Bad Request` if invalid payload, or `201 Created` with new item object.
* **`updateItem(req, res, next)`**: Verifies item existence and payload validity. Returns `200 OK` or `400`/`404`.
* **`deleteItem(req, res, next)`**: Deletes item by ID. Returns `200 OK` on success or `404 Not Found`.

---

## 7. [src/services/itemService.js](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/week1/src/services/itemService.js) — Service / Data Layer

Encapsulates data operations using an in-memory array (`this.items`):
* `getAllItems(filters)`: Returns items, filtered by category or status.
* `getItemById(id)`: Finds item matching numeric ID.
* `createItem(data)`: Generates auto-incrementing ID (`nextId++`), timestamps, and appends item.
* `updateItem(id, data)`: Merges new data fields and updates `updatedAt` timestamp.
* `deleteItem(id)`: Removes item from array.

---

## 8. [tests/item.test.js](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/week1/tests/item.test.js) — Test Suite

Uses Node's built-in `node:test` runner and `node:http` client.
* Binds server dynamically to a free port (`server = app.listen(0)`).
* Asserts responses for 9 distinct scenarios:
  1. `GET /health` -> `200 OK`
  2. `GET /api/items` -> `200 OK` array
  3. `GET /api/items/1` -> `200 OK` single object
  4. `GET /api/items/999` -> `404 Not Found`
  5. `POST /api/items` without auth -> `401 Unauthorized`
  6. `POST /api/items` with invalid payload -> `400 Bad Request`
  7. `POST /api/items` with valid payload -> `201 Created`
  8. `PUT /api/items/1` -> `200 OK` updated object
  9. `DELETE /api/items/2` -> `200 OK` deleted, subsequent GET returns `404`.

---

## 9. Configuration & Documentation Files
* **[package.json](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/week1/package.json)**: Configures dependencies (`express`, `cors`, `dotenv`), and scripts (`start`, `dev`, `test`).
* **[.gitignore](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/.gitignore)**: Excludes `node_modules/`, `.env`, logs, and OS/editor files from Git.
* **[SELF_ASSESSMENT.md](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/week1/SELF_ASSESSMENT.md)**: Submission form filled with developer ratings & reflections.
* **[docs/REST_API_BASICS.md](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/week1/docs/REST_API_BASICS.md)**: Summary of REST architecture & DB concepts.
* **[docs/GIT_WORKFLOW.md](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/week1/docs/GIT_WORKFLOW.md)**: Git branching & commit standards.
* **[docs/AI_PROMPTS.md](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/week1/docs/AI_PROMPTS.md)**: Learning prompts and safe AI usage notes.

---

# 🚀 How to Run the Project

### Step 1: Open Terminal & Navigate to `week1`
```bash
cd "c:\Users\user\Desktop\Projects AZM\fullstack\fullstack-dev\week1"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the API Server
* **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```
* **Production Mode:**
  ```bash
  npm start
  ```
  *Server output:*
  ```text
  =================================================
   Week 1 Node.js REST API Running
   Environment : development
   Server URL  : http://localhost:3000
   Health Check: http://localhost:3000/health
   Items API   : http://localhost:3000/api/items
  =================================================
  ```

### Step 4: Run Automated Tests
```bash
npm test
```
All 9 automated API test cases will execute and verify status codes and responses.

### Step 5: Test Endpoints via cURL or Postman

#### 1. Health Check (`GET /health`)
```bash
curl http://localhost:3000/health
```

#### 2. Get All Items (`GET /api/items`)
```bash
curl http://localhost:3000/api/items
```

#### 3. Create Item (`POST /api/items`) *(Requires Auth Header)*
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "x-api-key: secret-key-123" \
  -d '{"title": "Node.js Express Security", "category": "Backend", "status": "planned"}'
```

---

# 🔍 What is Missing (Future Roadmap for Production)

While this Week 1 project fulfills all foundational requirements, here is what is missing to make it production-ready (to prepare for **Week 2 & Week 4**):

1. **Persistent Database**:
   * *Current state:* Uses in-memory JavaScript arrays (`itemService.js`), which reset whenever the server restarts.
   * *Missing:* Database integration with SQL (PostgreSQL / SQLite / MySQL) or NoSQL (MongoDB).

2. **ORM / Query Builder Layer**:
   * *Current state:* Manual array filtering.
   * *Missing:* Integration with an ORM like **Prisma**, **TypeORM**, **Sequelize**, or **Mongoose**.

3. **Production Authentication & Security**:
   * *Current state:* Static hardcoded key check (`secret-key-123`).
   * *Missing:*
     * **JWT (JSON Web Tokens)** generation & verification (`jsonwebtoken`).
     * Password hashing using **bcrypt**.
     * Security headers using **Helmet** (`app.use(helmet())`).
     * Rate limiting (`express-rate-limit`).

4. **Schema Validation Library**:
   * *Current state:* Manual `if/else` checks in controller.
   * *Missing:* Declarative schema validation library like **Zod** or **Joi**.

5. **Environment Configuration File (`.env`)**:
   * *Current state:* `process.env.PORT` fallback.
   * *Missing:* Dedicated `.env` file and `.env.example` template.

6. **Containerization**:
   * *Missing:* `Dockerfile` and `docker-compose.yml` for multi-environment deployments.
