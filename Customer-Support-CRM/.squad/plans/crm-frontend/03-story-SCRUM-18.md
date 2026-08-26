# Story 03 — CRM-03: Next.js 15 Enterprise Portal Shell with RTL/LTR Arabic & English Support (Story: SCRUM-18)

---

## Prerequisites
* [Story 02 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-api/02-story-SCRUM-17.md): Express REST API running with OpenAPI contract on port 5000.

---

## Story Goal
Build a modern, high-performance Next.js 15 frontend application in `client/` featuring:
1. **Design System & Typography ([`SCRUM-33`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-33)):** Tailwind CSS configured with enterprise dark theme, sleek borders, channel badge tokens, and Google Fonts typography (Cairo for Arabic, Inter/Outfit for English).
2. **Reusable UI Component Library ([`SCRUM-34`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-34)):** Buttons, Badges (Status, Priority, Channel, Tier), Cards, Tabs, Dialogs, Inputs, Toast notifications, and Skeletons.
3. **Enterprise App Shell ([`SCRUM-35`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-35)):**
   * Responsive collapsible sidebar with active route highlighting.
   * Top navigation bar with instant **Arabic (RTL) ⇄ English (LTR)** language switcher and active agent selector.
   * TanStack React Query provider for type-safe caching and data fetching.
   * Central dashboard landing page showcasing system health, KPI cards, SLA ticker, recent tickets, and quick-action shortcuts.

---

## Context — Read These Files First
1. `server/src/openapi/openapi.json` — OpenAPI 3.0 schema and REST endpoints.
2. `server/src/server.ts` — Backend Express port and routes.

---

## Implementation Tasks

### 1 — Next.js 15 Client Scaffolding & Dependencies
Create `client/package.json` with:
* `next: ^15.1.0`, `react: ^19.0.0`, `react-dom: ^19.0.0`, `@tanstack/react-query: ^5.66.0`, `lucide-react: ^0.475.0`, `clsx`, `tailwind-merge`, `tailwindcss: ^3.4.17`, `typescript: ^5.7.3`.

Create `client/tsconfig.json`, `client/tailwind.config.ts`, `client/postcss.config.mjs`, `client/next.config.ts`.

### 2 — Global Design System & Bilingual Support
Create file: `client/src/app/globals.css`:
* Custom Tailwind color tokens (primary indigo/violet, channel greens/blues/purples/oranges).
* Glassmorphism utilities, smooth scrollbars, and dark mode background gradients.

Create file: `client/src/context/LanguageContext.tsx`:
* Manages `lang` state (`en` | `ar`), `dir` (`ltr` | `rtl`).
* Translation dictionary covering navigation, status labels, priority badges, channels, actions, and KPI metrics.

Create file: `client/src/context/AgentContext.tsx`:
* Manages current logged-in user profile (Ahmed Osama, Sara Al-Ghamdi, Khalid Al-Mansoor, Noura Al-Shehri).

### 3 — Reusable UI Components
* `client/src/components/ui/Button.tsx` (primary, secondary, outline, destructive, ghost, sizes).
* `client/src/components/ui/Badge.tsx` (Status: NEW/OPEN/PENDING/RESOLVED, Priority: LOW/MED/HIGH/URGENT, Channel: EMAIL/WHATSAPP/LIVE_CHAT/SMS/WEB, Tier: VIP/ENTERPRISE/STANDARD).
* `client/src/components/ui/Card.tsx`.
* `client/src/components/ui/Input.tsx` & `Select.tsx`.
* `client/src/components/ui/Modal.tsx`.
* `client/src/components/ui/Toast.tsx` with notification store.

### 4 — Enterprise Navigation Shell
* `client/src/components/layout/Sidebar.tsx`:
  * Navigation links to Customer 360, Kanban Board, Ticket List, Agent Workspace, Knowledge Base, Executive Analytics, and Public Portal.
* `client/src/components/layout/Header.tsx`:
  * Language toggle (العربية ⇄ English).
  * Agent role & profile switcher dropdown.
  * Live SLA breach counter indicator.
* `client/src/components/layout/AppShell.tsx`: Root layout wrapper injecting React Query and Language context providers.

### 5 — Landing Dashboard Page (`client/src/app/page.tsx`)
* Executive KPI summary metrics fetched via `/api/users/analytics`.
* Live SLA countdown alert ticker.
* Quick action shortcuts (New Ticket, Customer Search, Knowledge Base).
* Recent Omnichannel Ticket stream with real-time status badges.

---

## Edge Cases & Failure Modes
* **RTL Layout Mirroring:** `dir="rtl"` adjusts paddings, margins, icons, and sidebar alignment seamlessly.
* **Backend API Offline:** Graceful fallback to cached state or clear error banner with retry button.

---

## Test Plan
1. `npm run client:build` (`next build`) runs with 0 TypeScript/ESLint errors.
2. Verify language toggle shifts HTML `dir` attribute between `ltr` and `rtl` and switches all UI strings.
3. Verify navigation links and React Query client connectivity with Express server.

---

## Verification Steps
1. **Compilation:** `npm run client:build` succeeds.
2. **Browser Execution:** Start client with `npm run client:dev` on port 3000.
3. **Integration:** Dashboard correctly loads live analytics and ticket data from `http://localhost:5000/api`.

---

## Done Criteria
- [ ] Next.js 15 client configured with Tailwind CSS and Cairo/Inter fonts.
- [ ] Arabic (RTL) / English (LTR) language context and direction switcher working.
- [ ] Collapsible sidebar and top header navigation shell responsive across screen sizes.
- [ ] Reusable UI component library created and styled.
- [ ] Central dashboard page integrated with React Query API client.
- [ ] Client builds with 0 errors.
