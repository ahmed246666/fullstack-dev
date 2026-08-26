# Story 09 — CRM-09: Executive Analytics Dashboard & SLA Compliance Analytics (Story: SCRUM-24)

---

## Prerequisites
* [Story 08 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-kb/08-story-SCRUM-23.md): Knowledge Base system.
* [Story 02 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-api/02-story-SCRUM-17.md): `/api/users/analytics` endpoint.

---

## Story Goal
Deliver full Executive Analytics & SLA Performance Reporting Dashboard matching PDF Feature 8:
1. **Executive KPI Cards ([`SCRUM-51`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-51)):**
   * Total Tickets Volume, Open vs Resolved count, Average Resolution Time, SLA Compliance Rate (%), and Customer CSAT Score (out of 5.0).
2. **SLA Compliance Gauges & Channel Breakdown ([`SCRUM-52`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-52)):**
   * Visual gauge showing `ON_TRACK`, `APPROACHING_BREACH`, and `BREACHED` breakdown.
   * Omnichannel distribution bar across `WhatsApp`, `Email`, `Live Chat`, `SMS`, `Web Form`.
3. **Agent Workload & Performance Leaderboard ([`SCRUM-53`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-53)):**
   * Agent table ranking agents by assigned tickets, resolved volume, average first response time, and CSAT rating.

---

## Implementation Tasks

### 1 — Analytics Component Library
* `client/src/components/analytics/KPICard.tsx`: Premium glassmorphism KPI card.
* `client/src/components/analytics/SLAComplianceGauge.tsx`: SLA compliance percentage and health breakdown.
* `client/src/components/analytics/ChannelDistributionChart.tsx`: Omnichannel traffic distribution chart.
* `client/src/components/analytics/AgentLeaderboardTable.tsx`: Support agent performance leaderboard.

### 2 — Analytics Page & Executive Overview Assembly
* Update `client/src/app/analytics/page.tsx`.
* Update `client/src/app/page.tsx` (Dashboard home) with live analytics stats.

---

## Verification Steps
1. `npm run build` succeeds with 0 TypeScript/ESLint errors.
2. Verify live metrics reflect database tickets, SLA statuses, and CSAT scores.
3. Verify agent leaderboard lists all 4 agents with accurate workloads.
