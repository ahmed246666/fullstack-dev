# Story 10 — CRM-10: AI Support Copilot with Sentiment Analysis & Draft Replies (Story: SCRUM-54)

---

## Prerequisites
* [Story 09 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-analytics/09-story-SCRUM-24.md): Executive Analytics Dashboard.
* [Story 07 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-workspace/07-story-SCRUM-22.md): Agent workspace.

---

## Story Goal
Deliver full AI Support Copilot matching PDF Feature 9:
1. **AI Sentiment Analysis & Priority Classifier ([`SCRUM-55`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-55)):**
   * Real-time text analysis assessing customer sentiment (`POSITIVE`, `NEUTRAL`, `NEGATIVE`, `FRUSTRATED / URGENT`).
   * Visual sentiment badges with confidence scores and reasoning tags.
2. **1-Click AI Response Draft Generator ([`SCRUM-56`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-56)):**
   * Instant contextual draft reply generation tailored to the customer inquiry.
   * Multi-tone selection: `Professional`, `Empathetic`, `Technical / Concise`.
   * Dual language generation (Arabic & English) with 1-click "Insert to Reply".
3. **AI Ticket Summarizer & Next Action Suggestion ([`SCRUM-57`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-57)):**
   * 2-bullet executive summary extracting root issue and customer impact.
   * Suggested immediate next action for the support agent.

---

## Implementation Tasks

### 1 — AI Intelligence Service Engine
Create `client/src/lib/aiCopilot.ts`:
* Sentiment classification heuristics & confidence scorer.
* Multi-tone contextual draft generation engine in Arabic and English.
* Summarization and root-cause extractor.

### 2 — AI Copilot Widget Component
Create `client/src/components/ai/AICopilotWidget.tsx`:
* Sentiment analysis card with visual emoji & confidence indicator.
* AI summary & suggested next step card.
* 1-Click response generator with tone toggles and "Copy / Insert to Composer" buttons.

### 3 — Integration into Workspaces & Drawers
* Integrate `AICopilotWidget` into `client/src/components/tickets/TicketDrawer.tsx`.
* Integrate `AICopilotWidget` into `client/src/app/workspace/page.tsx`.

---

## Verification Steps
1. `npm run build` succeeds with 0 TypeScript/ESLint errors.
2. Verify sentiment analysis badge reflects urgent/frustrated tones on critical tickets.
3. Verify generating AI response draft populates composer in Arabic and English.
