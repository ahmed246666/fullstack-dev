# Story 07 — CRM-07: Interactive Agent Workspace with 1-Click Canned Responses, Macro Shortcuts & Internal Notes (Story: SCRUM-22)

---

## Prerequisites
* [Story 06 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-sla/06-story-SCRUM-21.md): Real-time SLA countdown and CSAT rating modal.
* [Story 02 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-api/02-story-SCRUM-17.md): `/api/users/canned-responses` and `/api/tickets/:id/notes`.

---

## Story Goal
Deliver a full Agent Workspace Console matching PDF Feature 4 & 5:
1. **Split-Pane Inbox View ([`SCRUM-45`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-45)):**
   * Left Pane: Filterable list of assigned tickets with unread counters, SLA badges, and channel icons.
   * Right Pane: Full interaction thread with customer details, SLA countdowns, and quick status changer.
2. **1-Click Canned Quick Replies & Macro Inserter ([`SCRUM-46`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-46)):**
   * Instant macro buttons (`/greet`, `/investigating`, `/invoice`, `/resolve`) that automatically populate the composer in Arabic or English.
   * Shortcut macro inserter popup when typing `/`.
3. **Internal Note Threading & Public Customer Reply ([`SCRUM-47`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-47)):**
   * Toggle between Public Customer Message and Private Internal Team Note.
   * Color-coded note bubbles (Amber for Internal, Indigo for Public) with author name and timestamp.

---

## Implementation Tasks

### 1 — Canned Response Toolbar & Macro Inserter
Create `client/src/components/workspace/CannedResponsesBar.tsx`:
* Fetch canned shortcuts via `api.getCannedResponses()`.
* 1-click chip buttons in English and Arabic.
* Clicking inserts text template into reply textarea.

### 2 — Agent Workspace Page Assembly
Update `client/src/app/workspace/page.tsx`:
* Split-screen layout (Queue list on left, Conversation thread + composer on right).
* Live search and status filter in agent queue.
* Quick ticket status transitions (`OPEN`, `PENDING`, `RESOLVED`).
* Full responsive design and dual RTL/LTR language support.

---

## Verification Steps
1. `npm run build` succeeds with 0 TypeScript/ESLint errors.
2. Verify clicking canned reply chip populates composer.
3. Verify adding internal note saves private note without sending to public customer portal.
