# Story 01 — Backend API Integration (Express + SQLite) & CORS Configuration (SCRUM-8)

- **Feature:** `backend-api`
- **Story Id:** `SCRUM-8`
- **Global Sequence:** 01
- **Status:** Ready for Execution
- **Stack:** Node.js, Express.js, `better-sqlite3`, `cors`, `dotenv`

---

## 1. Goal & Architecture Overview

Build a standalone, high-performance Node.js/Express REST API backend inside the `backend/` directory, backed by a local **SQLite** single-file database (`backend/database.sqlite`). The backend will expose RESTful endpoints for managing items, validate payloads, handle errors gracefully, support CORS for Next.js frontend integration (`http://localhost:3000`), and pass automated verification tests.

```
backend/
├── src/
│   ├── config/
│   │   └── db.js               # SQLite connection & table auto-migration
│   ├── controllers/
│   │   └── itemController.js   # Request handlers for GET and POST
│   ├── middleware/
│   │   ├── validateItem.js     # Body validation middleware
│   │   └── errorHandler.js     # Centralized error handler
│   ├── routes/
│   │   └── itemRoutes.js       # Express router endpoints
│   ├── services/
│   │   └── itemService.js      # SQL queries & DB operations
│   ├── app.js                  # Express application setup & middleware
│   └── server.js               # Server bootstrap & listener
├── tests/
│   └── api.test.js             # Automated endpoint test suite
├── .env.example                # Sample environment config
├── .env                        # Local environment variables
└── package.json                # Dependencies and run scripts
```

---

## 2. API Contract & Data Schema

### 2.1 SQLite Schema (`items` table)
```sql
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in-progress', 'completed')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Endpoints

#### `GET /api/items`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": 1,
        "title": "Setup Next.js Frontend",
        "description": "Initialize App Router with TypeScript",
        "status": "pending",
        "createdAt": "2026-08-26 10:00:00"
      }
    ]
  }
  ```

#### `POST /api/items`
* **Request Body:**
  ```json
  {
    "title": "Build UI Components",
    "description": "Use Squad Kit design tokens",
    "status": "pending"
  }
  ```
* **Validation Rules:**
  * `title`: Required, string, trimmed length $\ge$ 3 characters.
  * `status` (optional): Must be one of `['pending', 'in-progress', 'completed']`.
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "title": "Build UI Components",
      "description": "Use Squad Kit design tokens",
      "status": "pending",
      "createdAt": "2026-08-26 10:05:00"
    }
  }
  ```
* **Validation Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Validation Error",
    "errors": ["Title must be at least 3 characters long"]
  }
  ```

#### `GET /health`
* **Response (200 OK):**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-08-26T10:00:00.000Z"
  }
  ```

---

## 3. Implementation Tasks

- [ ] **Task 1: Package Scaffolding**
  - Create `backend/package.json` with dependencies: `express`, `cors`, `dotenv`, `better-sqlite3`.
  - Add scripts: `"start": "node src/server.js"`, `"dev": "node --watch src/server.js"`, `"test": "node --test tests/api.test.js"`.
  - Create `.env` and `.env.example` with `PORT=5000` and `FRONTEND_URL=http://localhost:3000`.

- [ ] **Task 2: Database Layer** (`backend/src/config/db.js`)
  - Connect to SQLite file using `better-sqlite3` (`database.sqlite`).
  - Execute schema creation table migration if not exists.

- [ ] **Task 3: Service Layer** (`backend/src/services/itemService.js`)
  - `getAllItems()`: Execute prepared query `SELECT * FROM items ORDER BY createdAt DESC`.
  - `createItem({ title, description, status })`: Prepared insert statement, return inserted record with generated `id`.

- [ ] **Task 4: Validation & Middleware**
  - `backend/src/middleware/validateItem.js`: Validate presence, type, length, and allowed status values. Return 400 on error.
  - `backend/src/middleware/errorHandler.js`: Catch unhandled errors, log stack, return 500 JSON envelope.

- [ ] **Task 5: Controller & Routes**
  - `backend/src/controllers/itemController.js`: Call service methods, return 200/201 JSON envelopes.
  - `backend/src/routes/itemRoutes.js`: Map `GET /` and `POST /` with validation middleware.

- [ ] **Task 6: Application Assembly**
  - `backend/src/app.js`: Initialize Express, configure `cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' })`, `express.json()`, mount `/api/items` and `/health`, attach error handler.
  - `backend/src/server.js`: Listen on `PORT` (5000).

- [ ] **Task 7: Test Suite & Verification**
  - `backend/tests/api.test.js`: Using Node's native test runner (`node:test`, `node:assert`), start server on dynamic port, execute GET /health, GET /api/items, POST /api/items valid, and POST /api/items invalid. Verify status codes and payloads.

---

## 4. Verification Commands

```bash
# 1. Run unit/integration tests
cd backend && npm test

# 2. Start server
npm start
```
