# Story intake: SCRUM-7

- Folder: `.squad/stories/frontend-app/SCRUM-7/intake.md`
- Tracker: Jira Cloud (`SCRUM`)

---

## Feature

- **Feature name (display):** Frontend Application Setup
- **Feature slug (folder under `plans/`):** `frontend-app`

## Tracker (metadata)

- **Tracker type:** `jira`
- **Work item id:** `SCRUM-7`
- **Work item type:** `Story`
- **Status:** `In Progress`
- **Labels:** `frontend, nextjs, typescript, ui, design-system`

---

## Title

```
FS-W3-01: Setup Next.js Frontend Application with TypeScript & Design System
```

---

## Description

```
Initialize Next.js frontend application with App Router, TypeScript, modern design system tokens, centralized API client layer, and responsive shell.
```

---

## Acceptance criteria

```markdown
1. Next.js App Router application created in `frontend/` directory running on port 3000.
2. Full TypeScript configuration (`tsconfig.json`) with strict type-safety.
3. TypeScript model definitions matching Express backend schema:
   - `Item`: `id`, `title`, `description`, `status` ('pending' | 'in-progress' | 'completed'), `createdAt`.
   - `ApiResponse<T>`: `success`, `data`, `count`, `message`, `errors`.
4. Design System & Styling (`globals.css`):
   - Premium enterprise theme with rich color palette (deep slate, violet/indigo accents, crisp borders, subtle glows).
   - Modern typography (Inter / system font stack).
   - Reusable CSS utility tokens for buttons, cards, inputs, badges, and modals.
5. Centralized API client (`src/lib/api.ts`):
   - Configured with `NEXT_PUBLIC_API_URL` (fallback `http://localhost:5000/api`).
   - Typed methods: `fetchItems()`, `fetchItemById(id)`, `createItem(payload)`, `deleteItem(id)`.
   - Timeout and error handling wrapper.
6. Navigation & Layout Shell (`src/app/layout.tsx` & `Navbar.tsx`):
   - Header with branding, live backend health status indicator badge, and navigation tabs.
   - Clean main content area and footer.
7. Zero build or lint errors (`npm run build`).
```

---

## Attachments

| File (relative to this folder) | What it is |
| ------------------------------ | ---------- |
| None | N/A |

---

## Dependencies

- **Blocked by / related ids:** `SCRUM-8` (Backend API — Completed)
- **Depends on code areas:** `backend/` running on `http://localhost:5000`

## Out of scope

- Specific items list and modal components (covered in `SCRUM-9` and `SCRUM-10`).
- Auth / multi-user session management.
