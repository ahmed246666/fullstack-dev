> **Squad Kit Story Intake:** [SCRUM-65](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-65)  
> *Created: 2026-08-30T14:15:00.000Z*

## Source — work item (from tracker)

**Title:** CRM-13: AI Portal Copilot, Analytics Reporting & SLA Escalation Engine  
**Type:** Story  
**Status:** Completed

### Description

PDF Requirements 5, 7, 8, 9, 10:
1. **Interactive AI Customer Support Chatbot on Portal**: Self-service chatbot powered by Google Gemini 1.5 Flash API with local Knowledge Base RAG fallback, suggesting articles and enabling 1-click ticket escalation.
2. **Real CSV Data Export Engine**: Direct download of formatted CSV reports for tickets and agent leaderboard statistics.
3. **Automated SLA Escalation Engine**: Backend automation checking overdue tickets against SLA targets and escalating priority to CRITICAL with audit logging.

### Attachments

None.

---
# Story intake

- Folder: `.squad/stories/crm-intelligence/SCRUM-65/intake.md`
- Related Plan: `.squad/plans/crm-intelligence/13-story-SCRUM-65.md`

---

## Feature

- **Feature name (display):** AI Intelligence & Reporting Operations
- **Feature slug (folder under `plans/`):** `crm-intelligence`

## Tracker (metadata only)

- **Tracker type:** `jira`
- **Work item id:** `SCRUM-65`
- **Work item type:** `Story`
- **Status:** `Completed`
- **Assignee:** `Ahmed Osama`
- **Labels:** `ai`, `reporting`, `sla`

---

## Title

```
CRM-13: AI Portal Copilot, Analytics Reporting & SLA Escalation Engine
```

---

## Description

*(Detailed requirements and acceptance criteria)*

1. Add `ai.service.ts` connecting Google Gemini 1.5 Flash API with Knowledge Base RAG fallback.
2. Add `POST /api/ai/chatbot` and interactive floating `PortalChatbotWidget.tsx` on `/portal`.
3. Add `GET /api/users/export-report?type=tickets|agents` and CSV download buttons on `/analytics`.
4. Add `POST /api/tickets/escalate-overdue` to escalate overdue tickets with audit logging.

