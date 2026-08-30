# Story 13 — CRM-13: AI Portal Copilot, Analytics Reporting & SLA Escalation Engine (Story: SCRUM-65)

---

## Status: Completed (Verified & Deployed)

## Prerequisites
* [Story 11 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-rbac/11-story-SCRUM-58.md): Enterprise JWT Authentication & RBAC.
* [Story 12 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-phase-2/12-story-SCRUM-64.md): Attachments, KB authoring, auto-assignment & agent tasks.


---

## Feature Scope & Goals


### 1. Interactive AI Chatbot on Customer Portal (Requirements 7 & 8)
* **Goal**: Enable self-service support on `/portal` where customers can converse with an AI chatbot that answers questions using the Knowledge Base and provides 1-click ticket escalation.
* **Backend**: `POST /api/ai/chatbot` querying relevant knowledge base articles and generating smart bilingual solutions.
* **Frontend**: Floating/embedded `PortalChatbotWidget.tsx` on [`portal/page.tsx`](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/client/src/app/portal/page.tsx).

### 2. Real CSV Data Export & Reporting Engine (Requirement 9)
* **Goal**: Provide downloadable reporting data for executive reviews and compliance audits.
* **Backend**: `GET /api/users/export-report?type=tickets|sla|agents` generating standard CSV streams.
* **Frontend**: Interactive Export button with modal options on [`analytics/page.tsx`](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/client/src/app/analytics/page.tsx).

### 3. Automated SLA Escalation & Breach Warning System (Requirements 5 & 10)
* **Goal**: Proactively flag tickets nearing breach and trigger automatic priority escalation.
* **Backend**: `POST /api/tickets/escalate-overdue` checking resolution deadlines against SLA policies and escalating overdue tickets with audit logging.
* **Frontend**: Imminent breach notification counter badge in [`Header.tsx`](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/client/src/components/layout/Header.tsx).

---


## Implementation Tasks

### Step 1: Backend AI Chatbot & Export Endpoints
1. Create `server/src/controllers/ai.controller.ts` with `chatWithBot`.
2. Add `exportReportCSV` in `server/src/controllers/user.controller.ts`.
3. Add `escalateOverdueTickets` in `server/src/controllers/ticket.controller.ts`.

### Step 2: Frontend Client API Methods
Update `client/src/lib/api.ts`:
* `chatWithPortalBot(message, history)`
* `downloadReportCSV(type)`
* `escalateOverdueTickets()`

### Step 3: Frontend UI Components
1. Create `client/src/components/portal/PortalChatbotWidget.tsx`.
2. Add CSV Export button to `client/src/app/analytics/page.tsx`.
3. Add SLA Breach alert badge in `client/src/components/layout/Header.tsx`.

---

## Verification Plan
1. `npm run build` succeeds on both `server` and `client`.
2. Verify customer chatbot answers queries and escalates to a ticket.
3. Verify clicking CSV export downloads real `.csv` file.
4. Verify overdue tickets get automatically escalated.
