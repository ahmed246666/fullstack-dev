# Story 05 — CRM-05: Omnichannel Ticket Management & Interactive Drag-and-Drop Kanban Board (Story: SCRUM-20)

---

## Prerequisites
* [Story 04 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-customers/04-story-SCRUM-19.md): Customer 360 module with drawer and touchpoints timeline.
* [Story 02 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-api/02-story-SCRUM-17.md): Ticket REST API routes (`/api/tickets`, `/api/tickets/:id/status`, `/api/tickets/:id/notes`).

---

## Story Goal
Deliver full Omnichannel Ticket Ingestion & Interactive Drag-and-Drop Kanban Board matching PDF Feature 2:
1. **Omnichannel Ingestion & Multi-Channel Filters ([`SCRUM-39`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-39)):**
   * Filter tickets by Channel: `WhatsApp`, `Email`, `Live Chat`, `SMS`, `Web Form`.
   * Filter by Priority: `URGENT`, `HIGH`, `MEDIUM`, `LOW`.
   * Real-time search across ticket number (`TCK-100X`), customer name, and subject.
2. **Interactive Drag-and-Drop Kanban Board ([`SCRUM-40`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-40)):**
   * 4 Status Columns: `NEW`, `OPEN`, `PENDING`, `RESOLVED`.
   * HTML5 / React drag-and-drop between columns that immediately triggers `PATCH /api/tickets/:id/status` and refreshes board cache.
   * Visual drop indicators, count chips, priority tags, and channel icons.
3. **Ticket Detail Slide-Over Drawer ([`SCRUM-41`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-41)):**
   * Slide-over drawer with full ticket conversation thread (customer issue + internal notes + public replies).
   * Live SLA countdown calculation badge.
   * Agent assignment dropdown and quick status changer.

---

## Context — Read These Files First
1. `server/src/controllers/ticket.controller.ts` — `/api/tickets/:id/status` status transition handler.
2. `client/src/components/ui/Badge.tsx` — Status, Priority, Channel, SLABadge components.
3. `client/src/app/tickets/kanban/page.tsx` — Current Kanban board page.

---

## Implementation Tasks

### 1 — Ticket Detail Drawer Component
Create `client/src/components/tickets/TicketDrawer.tsx`:
* Slides over from right (or left in RTL).
* Displays ticket number, title, customer name, channel badge, priority badge, SLA state.
* Conversation thread displaying chronological audit of notes with author avatars and timestamps.
* Quick reply / internal note composer.
* Quick status update dropdown triggering `PATCH /api/tickets/:id/status`.

### 2 — Interactive Drag-and-Drop Kanban Board Component
Create `client/src/components/tickets/KanbanBoard.tsx`:
* Drag-and-drop event handlers (`onDragStart`, `onDragOver`, `onDrop`, `onDragLeave`).
* Visual dropzone highlighting on hover.
* Optimistic UI update on status drop.

### 3 — Tickets & Kanban Page Assembly
* Update `client/src/app/tickets/kanban/page.tsx` to use `KanbanBoard` and `TicketDrawer`.
* Update `client/src/app/tickets/page.tsx` with sorting, search, pagination, and `TicketDrawer`.

---

## Verification Steps
1. `npm run build` succeeds with 0 TypeScript/ESLint errors.
2. Verify dragging a ticket card between columns updates its status in the backend.
3. Verify clicking a card opens the Ticket Drawer with conversation notes and reply box.
