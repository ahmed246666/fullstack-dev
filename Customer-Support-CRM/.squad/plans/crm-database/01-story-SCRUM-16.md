# Story 01 — CRM-01: Prisma ORM Data Modeling & Multi-Entity SQLite Database Schema (Story: SCRUM-16)

---

## Prerequisites
* None. (This is the foundational persistence layer story for the CRM).

---

## Story Goal
Establish a robust, type-safe SQLite database schema using Prisma ORM in `server/` with models that support all 12 core Customer Support CRM features from the specification PDF:
1. Multi-entity schema modeling `User` (RBAC: ADMIN, AGENT, CUSTOMER), `Customer`, `Ticket`, `Note` / `Activity`, `SLAConfig`, `KnowledgeArticle`, `AuditLog`, and `CannedResponse`.
2. TypeScript configuration and Prisma client generation.
3. Database migration setup targeting local SQLite database `server/prisma/dev.db`.
4. Comprehensive seed script in TypeScript (`server/prisma/seed.ts`) populating bilingual (Arabic & English) mock data for tickets across omnichannel sources (Email, WhatsApp, Live Chat, SMS, Web Form), SLA targets, canned replies, and knowledge base articles.

---

## Context — Read These Files First
1. `.env` — Environment configuration for database URL and server port.
2. `.squad/stories/crm-database/SCRUM-16/intake.md` — Jira intake description for SCRUM-16.

---

## Implementation Tasks

### 1 — Server Package Setup & Dependencies
Create file: `server/package.json` with TypeScript, Prisma, and Express dependencies:
* `@prisma/client`, `prisma`, `typescript`, `ts-node`, `@types/node`, `dotenv`.

Create file: `server/tsconfig.json`:
* Strict type-checking, ES2022 target, CommonJS module resolution.

Create file: `server/.env`:
* `DATABASE_URL="file:./dev.db"`
* `PORT=5000`

### 2 — Prisma Schema Modeling
Create file: `server/prisma/schema.prisma` with datasource `sqlite` and generator `prisma-client-js`.
Define models:
* `User`: `id`, `name`, `nameAr`, `email`, `role` (ADMIN, AGENT, CUSTOMER), `department`, `status`, `avatarUrl`, relations to assigned tickets, notes, and audit logs.
* `Customer`: `id`, `name`, `nameAr`, `email`, `phone`, `company`, `tier` (STANDARD, VIP, ENTERPRISE), `avatarUrl`, `status`, `createdAt`, `updatedAt`, relation to `tickets`.
* `Ticket`: `id`, `ticketNumber`, `title`, `description`, `status` (NEW, OPEN, PENDING, RESOLVED, CLOSED), `priority` (LOW, MEDIUM, HIGH, URGENT), `channel` (EMAIL, WHATSAPP, LIVE_CHAT, SMS, WEB_FORM), `category`, `department`, `customerId`, `assignedAgentId`, `responseDueAt`, `resolutionDueAt`, `firstResponseAt`, `resolvedAt`, `csatRating`, `csatFeedback`, relations to `Customer`, `User`, `Note`.
* `Note`: `id`, `ticketId`, `authorId`, `authorName`, `content`, `isInternal`, `channel`, `createdAt`, relations to `Ticket` and `User`.
* `SLAConfig`: `id`, `priority` (unique), `responseTimeHours`, `resolutionTimeHours`, `escalationRole`.
* `KnowledgeArticle`: `id`, `slug` (unique), `title`, `titleAr`, `content`, `contentAr`, `category`, `tags`, `helpfulVotes`, `unhelpfulVotes`, `isPublished`, `createdAt`, `updatedAt`.
* `AuditLog`: `id`, `actorId`, `actorName`, `action`, `entity`, `entityId`, `details`, `createdAt`.
* `CannedResponse`: `id`, `shortcut`, `title`, `titleAr`, `content`, `contentAr`, `category`.

### 3 — Database Migration
Run `npx prisma db push` or `npx prisma migrate dev --name init` to create the SQLite schema in `server/prisma/dev.db` and generate the Prisma Client.

### 4 — TypeScript Seed Script
Create file: `server/prisma/seed.ts`:
* Seeds admin user, 3 agents (Support, Billing, Technical).
* Seeds 5 customers with profiles, tiers, and interaction details.
* Seeds 10 tickets spanning all statuses (New, Open, Pending, Resolved), omnichannel badges (Email, WhatsApp, Live Chat, SMS, Web), and SLA target timestamps.
* Seeds internal and external customer conversation notes.
* Seeds default SLA configuration policies for all priority tiers.
* Seeds bilingual Knowledge Base FAQs (Arabic and English).
* Seeds Canned Responses for 1-click agent replies.
* Seeds audit log entries.

---

## Edge Cases & Failure Modes
* **Database lock on concurrent access:** SQLite handles single-writer concurrency; connection timeouts configured properly in Prisma.
* **DateTime serialisation:** Date objects formatted in ISO-8601 for full timezone consistency across Arabic and English locales.
* **Seed idempotency:** `seed.ts` clears existing tables in reverse dependency order before inserting new mock records.

---

## Test Plan
1. `npx ts-node server/prisma/seed.ts` runs cleanly without foreign-key violation errors.
2. Query validation script verifies all relational joins (Customer -> Tickets -> Notes -> Agent).

---

## Verification Steps
1. **Prisma Client Generation:** `cd server && npx prisma generate` succeeds.
2. **Schema Synchronization:** `cd server && npx prisma db push` generates SQLite tables cleanly.
3. **Database Seeding:** `cd server && npx ts-node prisma/seed.ts` populates all 8 entities.

---

## Done Criteria
- [ ] `server/package.json` and `server/tsconfig.json` configured.
- [ ] `server/prisma/schema.prisma` contains all 8 multi-entity models.
- [ ] `server/prisma/dev.db` is populated with bilingual mock data via `server/prisma/seed.ts`.
- [ ] Prisma Client generated and ready for Express API controllers.
