# Story 02 — CRM-02: Express REST API Backend for Customers, Tickets & SLA Workflow (Story: SCRUM-17)

---

## Prerequisites
* [Story 01 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-database/01-story-SCRUM-16.md): Prisma ORM SQLite database schema and seeds ready in `server/prisma/dev.db`.

---

## Story Goal
Develop a fully typed Express REST API in `server/src/` with Prisma queries covering all 12 PDF features:
1. **Customer CRUD Controller & Routes:** Pagination, search filter, customer 360 profile drawer endpoints (`SCRUM-29`).
2. **Ticket Lifecycle Controller & Routes:** Omnichannel ticket creation, status transitions (`NEW` ➔ `OPEN` ➔ `PENDING` ➔ `RESOLVED` ➔ `CLOSED`), priority management, agent assignment, CSAT rating submission (`SCRUM-30`).
3. **Notes & Activity Thread Controller & Routes:** Internal and external messages (`SCRUM-31`).
4. **SLA Engine & Dynamic Search Filter:** Automatic calculation of `responseDueAt` and `resolutionDueAt` timestamps based on priority policies, live breach indicators (`SCRUM-32`).
5. **OpenAPI 3.0 Contract & Swagger Documentation:** Interactive API documentation and JSON schema export ready for `openapi-typescript` and `@tanstack/react-query`.

---

## Context — Read These Files First
1. `server/prisma/schema.prisma` — Entity definitions for User, Customer, Ticket, Note, SLAConfig, KnowledgeArticle, CannedResponse, AuditLog.
2. `server/.env` — Environment configuration for Port and Database URL.

---

## Implementation Tasks

### 1 — Server & Prisma Singleton Setup
* Create file: `server/src/db.ts` — Prisma client singleton with connection logging and cleanup handlers.
* Create file: `server/src/services/sla.service.ts` — SLA deadline calculator (`calculateSLADeadlines(priority)`) and breach status evaluator (`getTicketSLAStatus(ticket)`).

### 2 — Customer Management Endpoints (`SCRUM-29`)
* Create file: `server/src/controllers/customer.controller.ts`:
  * `getCustomers`: Search by name/email/company, filter by tier (`STANDARD`, `VIP`, `ENTERPRISE`), pagination.
  * `getCustomerById`: Returns customer profile + ticket history + interaction stats.
  * `createCustomer`: Validates email and phone, inserts new customer.
  * `updateCustomer`: Updates customer profile fields.
* Create file: `server/src/routes/customer.routes.ts`.

### 3 — Ticket & SLA Workflow Endpoints (`SCRUM-30`, `SCRUM-32`)
* Create file: `server/src/controllers/ticket.controller.ts`:
  * `getTickets`: Omnichannel filter (`channel`, `status`, `priority`, `department`, `agentId`), search query, calculates dynamic SLA breach state (`ON_TRACK`, `APPROACHING_BREACH`, `BREACHED`).
  * `getTicketById`: Returns ticket with Customer, Agent, Notes, and computed SLA countdown.
  * `createTicket`: Auto-generates unique ticket number (e.g. `TCK-1006`), computes SLA response/resolution deadlines via `sla.service.ts`, creates initial audit log.
  * `updateTicketStatus`: Updates status, records `firstResponseAt` / `resolvedAt` timestamps, logs audit entry.
  * `assignTicket`: Assigns agent, updates department, logs audit entry.
  * `submitCSAT`: Records 1-5 star rating and feedback text.
* Create file: `server/src/routes/ticket.routes.ts`.

### 4 — Notes & Activity Thread Endpoints (`SCRUM-31`)
* Create file: `server/src/controllers/note.controller.ts`:
  * `getTicketNotes`: Lists all notes ordered chronologically.
  * `addTicketNote`: Adds note (internal agent note or customer channel response), updates ticket status if needed.
* Create file: `server/src/routes/note.routes.ts`.

### 5 — Knowledge Base, Users, & Canned Replies Endpoints
* Create file: `server/src/controllers/knowledge.controller.ts` & `server/src/routes/knowledge.routes.ts`:
  * `getArticles`: Search by query, filter by category.
  * `voteArticle`: Upvote/downvote helpfulness.
* Create file: `server/src/controllers/user.controller.ts` & `server/src/routes/user.routes.ts`:
  * `getAgents`: Lists all active agents for dropdowns and assignment.
  * `getCannedResponses`: Lists canned responses for quick 1-click reply insertion.

### 6 — OpenAPI 3.0 Specification & Swagger UI
* Create file: `server/src/openapi/openapi.json` — Complete OpenAPI 3.0 JSON specification matching all routes.
* Create file: `server/src/openapi/swagger.ts` — Swagger UI middleware on `/api-docs` and JSON spec on `/api/openapi.json`.

### 7 — Server Entry Point
* Create file: `server/src/server.ts` — Mounts all routers under `/api`, enables CORS, JSON body parser, health check `/api/health`, and global error handler.

---

## Edge Cases & Failure Modes
* **Duplicate Email on Customer Creation:** Controller checks existing email and returns clean 409 Conflict.
* **Invalid Status Transitions:** Validates status against allowed enum values (`NEW`, `OPEN`, `PENDING`, `RESOLVED`, `CLOSED`).
* **Missing SLA Target:** Falls back to default medium priority (4h response / 24h resolution) if priority config is missing.

---

## Test Plan
1. `server/tests/api.test.ts` executes end-to-end HTTP request tests against all endpoints (`/api/health`, `/api/customers`, `/api/tickets`, `/api/notes`, `/api/knowledge-base`, `/api/users/agents`, `/api/canned-responses`, `/api/openapi.json`).
2. Run `npm run server:build` (`tsc`) to verify 0 TypeScript compiler errors.

---

## Verification Steps
1. **Compilation:** `npm run server:build` succeeds without errors.
2. **API Execution:** Start server with `npm run server:dev` on port 5000.
3. **Endpoint Tests:** Run automated test script `tsx tests/api.test.ts` verifying status 200/201 and valid JSON responses across all routes.

---

## Done Criteria
- [ ] Express server starts on port 5000 with CORS and JSON middleware.
- [ ] Customer endpoints (`GET /api/customers`, `POST /api/customers`, `GET /api/customers/:id`) implemented and verified.
- [ ] Ticket endpoints with SLA calculations (`GET /api/tickets`, `POST /api/tickets`, `PATCH /api/tickets/:id/status`) implemented and verified.
- [ ] Note, Knowledge Base, Agent, and Canned Response endpoints implemented and verified.
- [ ] OpenAPI 3.0 JSON specification exposed at `/api/openapi.json`.
- [ ] Automated API test suite passes 100%.
