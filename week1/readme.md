# Week 1 — Engineering Foundations & Node.js REST API Exercise

**Enterprise Full-Stack Development Program**  
**Developer:** Ahmed Osama Ezzat Ahmed Hamed  
**Role:** Senior Developer (Primary Stack: React.js / Next.js / TypeScript)  
**Submission Date:** 02-08-2026  
**Repository Branch:** [`week-1`](https://github.com/ahmed246666/fullstack-dev/tree/week-1)

---

## 📌 Executive Summary

This repository contains the complete **Week 1 Deliverables** for the Enterprise Full-Stack Development Program. The primary goal of Week 1 is building a solid common engineering baseline across REST API architecture, HTTP protocol fundamentals, database concepts (SQL vs NoSQL), Git workflows, debugging methods, and responsible AI usage.

---

## 📁 Repository Structure

```text
week1/
├── docs/
│   └── CODEBASE_EXPLANATION.md # Line-by-line breakdown & run guide
├── src/
│   ├── controllers/
│   │   └── itemController.js   # Handles API logic, input validation & JSON formatting
│   ├── middleware/
│   │   ├── authMiddleware.js   # Header key & Bearer token authentication middleware
│   │   └── errorHandler.js     # 404 handler and global exception handler middleware
│   ├── routes/
│   │   └── itemRoutes.js       # Endpoint mapping for /api/items resource
│   ├── services/
│   │   └── itemService.js      # In-memory database CRUD service
│   ├── app.js                  # Express app setup and middleware configuration
│   └── server.js               # HTTP server entry point
├── tests/
│   └── item.test.js            # Automated REST API test suite (node:test)
├── .env                        # Local environment variables
├── .env.example                # Environment variable template
├── package.json                # NPM configuration, dependencies & scripts
└── readme.md                   # Project documentation & run guide
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18.0.0 or higher (Tested on Node v24.11.1)
* **npm**: v9.0.0 or higher

### 1. Installation
Navigate to the `week1` directory and install dependencies:
```bash
cd week1
npm install
```

### 2. Running the Server
* **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```
* **Production Mode:**
  ```bash
  npm start
  ```
  The API server will listen on `http://localhost:3000`.

### 3. Running Automated Tests
Run the test suite using Node's native test runner:
```bash
npm test
```

---

## 🛠️ API Reference (`/api/items`)

| Method | Endpoint | Auth Required? | Expected Status Codes | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`GET`** | `/health` | No | `200 OK` | Server health check endpoint |
| **`GET`** | `/api/items` | No | `200 OK` | Fetch all items (Supports `?category=` and `?status=`) |
| **`GET`** | `/api/items/:id` | No | `200 OK`, `404 Not Found` | Fetch single item by ID |
| **`POST`** | `/api/items` | Yes (`x-api-key`) | `201 Created`, `400 Bad Request`, `401 Unauthorized` | Create a new item |
| **`PUT`** | `/api/items/:id` | Yes (`x-api-key`) | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found` | Update an existing item |
| **`DELETE`**| `/api/items/:id` | Yes (`x-api-key`) | `200 OK`, `401 Unauthorized`, `404 Not Found` | Delete an item by ID |

> 🔑 **Authentication Note**: Write operations (`POST`, `PUT`, `DELETE`) require the HTTP header:  
> `x-api-key: secret-key-123` or `Authorization: Bearer demo-token`.

---

## 🧪 Example API Requests & Responses

### 1. Create a New Item (`POST /api/items`)
**Request:**
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "x-api-key: secret-key-123" \
  -d '{
    "title": "Learn Node.js Express Middleware",
    "category": "Backend",
    "description": "Building custom middleware for logging and authentication.",
    "status": "planned"
  }'
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Item created successfully",
  "data": {
    "id": 4,
    "title": "Learn Node.js Express Middleware",
    "category": "Backend",
    "description": "Building custom middleware for logging and authentication.",
    "status": "planned",
    "createdAt": "2026-08-03T16:30:00.000Z",
    "updatedAt": "2026-08-03T16:30:00.000Z"
  }
}
```

### 2. Validation Error Response (`400 Bad Request`)
**Request:**
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "x-api-key: secret-key-123" \
  -d '{ "title": "" }'
```

**Response (`400 Bad Request`):**
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed for item payload.",
  "details": [
    { "field": "title", "message": "Title is required and must be a non-empty string." },
    { "field": "category", "message": "Category is required and must be a non-empty string." }
  ]
}
```

---

## 📝 Document links
* [Codebase Line-by-Line Breakdown & Run Guide](docs/CODEBASE_EXPLANATION.md)
