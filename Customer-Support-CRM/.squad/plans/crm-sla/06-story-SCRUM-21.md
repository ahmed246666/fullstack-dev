# Story 06 — CRM-06: Real-time SLA Calculation Engine, Alert Banners & CSAT Feedback (Story: SCRUM-21)

---

## Prerequisites
* [Story 05 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-tickets/05-story-SCRUM-20.md): Omnichannel Kanban and Ticket inspection drawer.
* [Story 02 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-api/02-story-SCRUM-17.md): SLA service calculation and `/api/tickets/:id/csat` route.

---

## Story Goal
Deliver full SLA calculation engine, breach alert system, and CSAT customer feedback rating matching PDF Feature 3 & Feature 7:
1. **Real-time SLA Calculation Engine ([`SCRUM-42`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-42)):**
   * Compute dynamic SLA deadlines per priority level (`URGENT`: 1h response/4h resolution, `HIGH`: 2h/8h, `MEDIUM`: 4h/24h, `LOW`: 8h/48h).
   * Dynamically evaluate states: `ON_TRACK`, `APPROACHING_BREACH` (< 2 hours remaining), `BREACHED` (expired), `RESOLVED_ON_TIME`, and `RESOLVED_LATE`.
2. **Breach Alert Banners & Live Countdown ([`SCRUM-43`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-43)):**
   * Global SLA Breach Alert Banner on top of the CRM portal alerting agents of approaching and breached tickets.
   * Real-time ticking countdown badge component displaying remaining hours and minutes.
3. **CSAT Rating Modal & Survey ([`SCRUM-44`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-44)):**
   * Post-resolution customer satisfaction survey (1 to 5 stars + feedback comments).
   * Updates ticket CSAT score in database via `POST /api/tickets/:id/csat` and recalculates platform average CSAT in analytics.

---

## Implementation Tasks

### 1 — Live SLA Countdown Component
Create `client/src/components/sla/SLACountdownTimer.tsx`:
* Calculates remaining time against `resolutionDueAt` or `responseDueAt`.
* Color coded: Emerald (> 2h), Amber/Yellow (< 2h Approaching Breach), Rose/Red (< 0h Breached).
* Live timer tick interval updating every 30 seconds.

### 2 — Global SLA Breach Alert Banner
Create `client/src/components/sla/SLABreachBanner.tsx`:
* Queries active tickets from API.
* Filters for tickets in `BREACHED` or `APPROACHING_BREACH` status.
* Collapsible banner with direct link to open the critical ticket drawer.

### 3 — Post-Resolution CSAT Modal
Create `client/src/components/sla/CSATModal.tsx`:
* 5-star interactive rating selector.
* Feedback textarea for customer comments.
* Submits to `POST /api/tickets/:id/csat`.

### 4 — SLA Policy Configuration Modal
Create `client/src/components/sla/SLAPolicyDrawer.tsx`:
* View & update response/resolution SLA threshold hours per priority.
* Connects to `/api/users/sla-policies` and `/api/users/sla-configs/:priority`.

---

## Verification Steps
1. `npm run build` succeeds with 0 TypeScript/ESLint errors.
2. Verify countdown timer updates dynamically on tickets.
3. Verify submitting CSAT rating saves 1-5 star score to database and updates analytics KPI.
