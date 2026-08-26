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

### 1 — RBAC Enhancements
* Update `client/src/context/AgentContext.tsx` with role checking properties: `isAdmin`, `isAgent`.
* Add audit log query method to `client/src/lib/api.ts`: `getAuditLogs()`.
* Create `client/src/components/admin/AuditLogsDrawer.tsx`.

### 2 — Public Self-Service Customer Portal
* Update `client/src/app/portal/page.tsx` with:
  * Public lookup search box (Ticket code or Email).
  * Status timeline and public conversation thread.
  * Public reply sender.
  * "+ Submit Inquiry" modal for direct customer ingestion.

---

## Verification Steps
1. `npm run build` succeeds with 0 TypeScript/ESLint errors.
2. Verify switching to Support Agent restricts Admin-only controls.
3. Verify public portal `/portal` searches tickets and displays public timeline without exposing internal agent notes.
