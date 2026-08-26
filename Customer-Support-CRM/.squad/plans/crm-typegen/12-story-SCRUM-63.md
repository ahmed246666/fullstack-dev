# Story 12 — CRM-12: OpenAPI 3.0 TypeScript Client Generation & Custom React Query Hooks (Story: SCRUM-63)

---

## Prerequisites
* [Story 11 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-rbac/11-story-SCRUM-58.md): RBAC & Public Portal.
* [Story 02 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-api/02-story-SCRUM-17.md): `server/src/openapi/openapi.json` contract.

---

## Story Goal
Deliver end-to-end OpenAPI TypeScript Client generation & custom React Query hooks matching PDF Feature 11:
1. **OpenAPI TypeScript Schema Generation Script ([`SCRUM-64`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-64)):**
   * Generator script generating `client/src/lib/openapi-types.ts` directly from the OpenAPI 3.0 specification.
   * Add `"codegen"` command in root `package.json` and `client/package.json`.
2. **Type-safe Custom React Query Hooks ([`SCRUM-65`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-65)):**
   * Create `client/src/hooks/useCRMQuery.ts` providing custom hooks (`useCustomers`, `useTickets`, `useKnowledgeBase`, `useAnalytics`, `useAuditLogs`, `useCreateTicket`, `useUpdateTicketStatus`, `useSubmitCSAT`).
3. **Full Project End-to-End Verification ([`SCRUM-66`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-66)):**
   * Execute full verification suite: DB schema tests, API integration tests, TypeScript compile tests, Next.js 15 production build.
   * Generate comprehensive final project walkthrough & sprint completion summary.

---

## Implementation Tasks

### 1 — OpenAPI TypeScript Generator Script & Types
* Create `client/src/lib/openapi-types.ts` with complete type definitions from the OpenAPI 3.0 spec.
* Add npm script `"codegen"` to root and client `package.json`.

### 2 — Custom React Query Hooks Wrapper
* Create `client/src/hooks/useCRMQuery.ts` exporting strongly typed custom React Query hooks for queries and mutations.

### 3 — Sprint 1 Closure & Final Verification
* Run `npm run server:test` (8/8 tests passed).
* Run `npm run server:db:verify` (7/7 tests passed).
* Run `npm run build` (0 TypeScript / Next.js compilation errors).
* Transition all remaining Jira subtasks and close Sprint 1 in Jira.

---

## Verification Steps
1. `npm run codegen` executes cleanly.
2. `npm run build` succeeds with 0 TypeScript/ESLint errors.
3. Automated test suites pass 100%.
