# Story intake: SCRUM-9

- Folder: `.squad/stories/items-list/SCRUM-9/intake.md`
- Tracker: Jira Cloud (`SCRUM`)

---

## Feature

- **Feature name (display):** Items List & State Management
- **Feature slug (folder under `plans/`):** `items-list`

## Tracker (metadata)

- **Tracker type:** `jira`
- **Work item id:** `SCRUM-9`
- **Work item type:** `Story`
- **Status:** `In Progress`
- **Labels:** `frontend, nextjs, react, ui, list-view`

---

## Title

```
FS-W3-03: Responsive Items List Screen with Loading Skeletons & Error State
```

---

## Description

```
Build modern responsive item listing view in Next.js with client-side fetching from Express API, animated loading skeletons, empty state fallback, error alerts with retry action, search query filtering, and status tabs.
```

---

## Acceptance criteria

```markdown
1. `ItemList` client component renders on home page displaying all items fetched from `GET /api/items`.
2. Loading State:
   - Displays 3 animated skeleton placeholder cards with shimmer effect while fetch is in progress.
3. Error State:
   - Displays error banner/card if the backend API is unreachable or returns non-200.
   - Includes a "Retry" button that re-triggers data fetching.
4. Empty State:
   - Displays friendly empty state illustration/icon and guidance text when no items exist.
5. Interactive Filtering & Search:
   - Search input filter by item title or description in real-time.
   - Status tabs filter: "All", "Pending", "In Progress", "Completed" with item count badges.
6. `ItemCard` design:
   - Card surface with title, description, formatted date, colored status badge.
   - Delete button that triggers `DELETE /api/items/:id` and updates local state optimistically.
7. Smooth micro-interactions, responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop).
8. Zero console warnings, clean TypeScript types, passes `npm run build`.
```

---

## Attachments

| File (relative to this folder) | What it is |
| ------------------------------ | ---------- |
| None | N/A |

---

## Dependencies

- **Blocked by / related ids:** `SCRUM-7` (Frontend Scaffolding), `SCRUM-8` (Backend API)
- **Depends on code areas:** `frontend/src/lib/api.ts`, `frontend/src/types/item.ts`

## Out of scope

- Item creation modal (covered in `SCRUM-10`).
