# Story 04 — CRM-04: Customer 360 Management Module with Interaction History & Contact Profiles (Story: SCRUM-19)

---

## Prerequisites
* [Story 03 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-frontend/03-story-SCRUM-18.md): Next.js 15 enterprise shell, Tailwind tokens, and React Query client.
* [Story 02 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-api/02-story-SCRUM-17.md): `/api/customers` endpoints and customer 360 aggregation.

---

## Story Goal
Deliver full Customer 360 management module matching PDF Feature 1:
1. **Directory Table & Filter View ([`SCRUM-36`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-36)):**
   * Multi-column customer directory with search by name, email, company, or phone.
   * Filter tabs by Tier: `ALL`, `ENTERPRISE`, `VIP`, `STANDARD`.
   * Real-time metrics: Total open tickets count, ticket volume badge, and tier highlights.
2. **Customer 360 Slide-Over Drawer & Timeline ([`SCRUM-37`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-37)):**
   * Rich 360 profile drawer opening on customer selection.
   * Omnichannel interaction touchpoint timeline (chronological list of tickets, notes, channel sources, and SLA states).
   * Summary stats: total tickets, resolved count, open count, average CSAT.
3. **Customer Creation & Edit Modal ([`SCRUM-38`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-38)):**
   * Create new customer profile with validation (name in Arabic & English, company, email, phone, tier, custom avatar).
   * Instant optimistic cache update via React Query mutations.

---

## Context — Read These Files First
1. `server/src/controllers/customer.controller.ts` — GET `/api/customers/:id` with ticket relation aggregation.
2. `client/src/lib/api.ts` — `api.getCustomers`, `api.getCustomerById`, `api.createCustomer`.
3. `client/src/app/customers/page.tsx` — Current customer listing page.

---

## Implementation Tasks

### 1 — Customer 360 Drawer Component
Create `client/src/components/customers/CustomerDrawer.tsx`:
* Slides over from right (or left in RTL `dir="rtl"`).
* Displays customer header: avatar, name, nameAr, company, email, phone, tier badge, joined date.
* Displays 360 KPI cards: Total Tickets, Open Tickets, Resolved Tickets, Average CSAT.
* Chronological interaction timeline displaying all past customer tickets, statuses, channels, and dates.
* Quick-action button to open a new ticket pre-populated for this customer.

### 2 — Customer Create / Edit Modal Component
Create `client/src/components/customers/CustomerModal.tsx`:
* Bilingual form fields: English Name, Arabic Name, Company, Email, Phone, Tier (`ENTERPRISE`, `VIP`, `STANDARD`), Avatar URL.
* Form validation and error messaging.
* Connects to `POST /api/customers` via React Query mutation.

### 3 — Customer Directory Page Integration
Update `client/src/app/customers/page.tsx`:
* Table view and Card grid toggle.
* Connect Customer 360 drawer click events.
* Connect "+ Add Customer" button with modal.
* Dual Arabic / English text translations.

---

## Verification Steps
1. `npm run build` succeeds with 0 TypeScript/ESLint errors.
2. Verify customer search, tier filtering, clicking a customer opens the 360 drawer with ticket history.
3. Verify adding a new customer creates record in Prisma SQLite database and updates UI immediately.
