# Story intake: SCRUM-8

- Folder: `.squad/stories/backend-api/SCRUM-8/intake.md`
- Tracker: Jira Cloud (`SCRUM`)

---

## Feature

- **Feature name (display):** Backend API & Database
- **Feature slug (folder under `plans/`):** `backend-api`

## Tracker (metadata)

- **Tracker type:** `jira`
- **Work item id:** `SCRUM-8`
- **Work item type:** `Story`
- **Status:** `To Do`
- **Labels:** `backend, express, sqlite, api`

---

## Title

```
FS-W3-02: Backend API Integration (Express + SQLite) & CORS Configuration
```

---

## Description

```
Setup Node.js/Express backend with SQLite database persistence, REST endpoints (GET /api/items, POST /api/items), validation middleware, and CORS configuration for Next.js.
```

---

## Acceptance criteria

```markdown
1. Express backend runs in `backend/` directory on port 5000 (configurable via `.env`).
2. SQLite database (`database.sqlite` or `dev.db`) initialized with `items` table:
   - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
   - `title`: TEXT NOT NULL
   - `description`: TEXT
   - `status`: TEXT DEFAULT 'pending'
   - `createdAt`: DATETIME DEFAULT CURRENT_TIMESTAMP
3. `GET /api/items`:
   - Returns 200 OK with `{ success: true, count: number, data: Item[] }`.
   - Items sorted by `createdAt DESC`.
4. `POST /api/items`:
   - Validates `title` (required, string, non-empty, min 3 chars).
   - Validates `status` if provided (must be 'pending', 'in-progress', or 'completed').
   - Returns 400 Bad Request `{ success: false, message: string, errors: string[] }` on invalid input.
   - Inserts record into SQLite and returns 201 Created `{ success: true, data: Item }`.
5. `CORS` middleware enabled and configured to allow requests from `http://localhost:3000` (Next.js frontend).
6. Centralized error handling middleware returning standardized JSON error structure.
7. Automated verification tests verifying GET, POST, validation failure, and error handling.
```

---

## Attachments

| File (relative to this folder) | What it is |
| ------------------------------ | ---------- |
| None | N/A |

---

## Dependencies

- **Blocked by / related ids:** `SCRUM-6` (Parent Epic)
- **Depends on code areas:** None (Foundation backend service)

## Extra notes

- Stack: Node.js, Express, `better-sqlite3` (or `sqlite3`), `cors`, `dotenv`.
- Architecture: Controller-Service-Repository pattern with dedicated middleware.

## Out of scope

- Next.js frontend UI screens (covered in `SCRUM-7`, `SCRUM-9`, `SCRUM-10`).
- User authentication / JWT login (not required for Week 3 baseline).
