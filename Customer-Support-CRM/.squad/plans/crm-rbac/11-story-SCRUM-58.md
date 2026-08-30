# Story 11 — CRM-11: Security, Role-Based Access Control (RBAC) & Public Customer Self-Service Portal (Story: SCRUM-58)

---

## Prerequisites
* [Story 10 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-ai/10-story-SCRUM-54.md): AI Support Copilot.
* [Story 02 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-api/02-story-SCRUM-17.md): REST API and Audit logs endpoints.

---

## Story Goal
Deliver full RBAC & Public Customer Self-Service Portal matching PDF Feature 10 & 7:
1. **Role-Based Access Control (RBAC) ([`SCRUM-59`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-59)):**
   * Role differentiation (`ADMIN` vs `SUPPORT_AGENT`).
   * Permission guards controlling SLA configuration access, executive export tools, and user management.
2. **Public Customer Self-Service Portal ([`SCRUM-60`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-60)):**
   * Accessible without agent login at `/portal`.
   * Search ticket by tracking code (`TCK-1001`) or customer email.
   * View live status, SLA progress, public message thread, and submit replies.
   * "+ Create Support Ticket" public self-service ingestion form.
3. **Audit Log Activity Viewer ([`SCRUM-61`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-61)):**
   * Audit drawer for administrators displaying chronological actor actions (`UPDATE_SLA_POLICY`, `ASSIGN_TICKET`, `STATUS_CHANGE`).

---

## Implementation Tasks

### 1 — Enterprise JWT Authentication & RBAC Backend
* Update `server/prisma/schema.prisma` with `passwordHash` on `User` model.
* Seed default bcrypt password hashes (`Password123!`) in `server/prisma/seed.ts`.
* Implement `server/src/middlewares/auth.middleware.ts` with `authenticateJWT` and `requireRole`.
* Create `server/src/controllers/auth.controller.ts` (`login`, `getMe`, `register`) and mount `/api/auth` routes.
* Protect Admin-only endpoints (`/api/users/audit-logs`, `/api/users/sla-policies/:priority`).

### 2 — Frontend Route Protection & Role AuthGuard
* Update `client/src/lib/api.ts` to attach `Authorization: Bearer <token>` automatically and add auth endpoints.
* Update `client/src/context/AgentContext.tsx` with real backend JWT authentication, token storage, and verified `/api/auth/me` profile resolution.
* Implement `client/src/components/auth/AuthGuard.tsx` to guard private workspace routes and block non-admins from `/analytics`.
* Connect `client/src/app/login/page.tsx` with 1-click role accounts (`ADMIN`, `AGENT`), form credentials authentication, and error handling.

### 3 — Public Self-Service Customer Portal
* Accessible without agent login at `/portal`.
* Search ticket by tracking code (`TCK-1001`) or customer email.
* View live status, SLA progress, public message thread, and submit replies.
* "+ Submit Inquiry" modal for direct customer ingestion.

---

## Verification Steps
1. Backend `npm run build` succeeds with 0 TypeScript errors.
2. Frontend `npm run build` generates all static routes with 0 errors.
3. `POST /api/auth/login` issues valid JWT signed token.
4. Unauthenticated navigation to `/` or `/tickets` redirects to `/login`.
5. Non-admin login prevents access to `/analytics` with Access Restricted screen.
6. Public portal `/portal` searches tickets without exposing internal notes.

