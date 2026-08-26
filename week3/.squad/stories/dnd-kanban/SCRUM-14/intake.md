# Story intake: SCRUM-14

- Folder: `.squad/stories/dnd-kanban/SCRUM-14/intake.md`
- Tracker: Jira Cloud (`SCRUM`)

---

## Feature

- **Feature name (display):** Drag and Drop Kanban Board
- **Feature slug (folder under `plans/`):** `dnd-kanban`

## Tracker (metadata)

- **Tracker type:** `jira`
- **Work item id:** `SCRUM-14`
- **Work item type:** `Story`
- **Status:** `In Progress`
- **Labels:** `frontend, dnd-kit, kanban, drag-and-drop, backend`

---

## Title

```
FS-W3-08: Drag and Drop Kanban Board using @dnd-kit
```

---

## Description

```
Implement Kanban drag and drop board with columns (Pending, In Progress, Completed) using @dnd-kit, with backend status synchronization via PATCH endpoint, view toggle (Grid / Kanban), and optimistic UI updates.
```

---

## Acceptance criteria

```markdown
1. Backend Support:
   - Add `PATCH /api/items/:id/status` endpoint to update item status in SQLite.
   - Validates status parameter ('pending' | 'in-progress' | 'completed').
   - Returns updated item object (`200 OK`).
2. Frontend Drag and Drop (`@dnd-kit`):
   - Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
   - Kanban Board component rendering 3 droppable columns:
     - `Pending`
     - `In Progress`
     - `Completed`
   - Draggable cards inside each column.
   - Dragging a card across columns updates its status locally (optimistic) and sends `PATCH` request to the backend.
   - If the backend request fails, revert local state and show error toast.
3. View Toggle in UI:
   - Toggle switch in toolbar: "Grid View" vs. "Kanban Board".
4. Visual Design:
   - Droppable column container with column headers, item counts, and subtle hover borders during drag-over.
   - Clean drag overlay showing the floating card during drag.
5. Passes `npm test` in backend and `npm run build` in frontend with 0 errors.
```

---

## Attachments

| File (relative to this folder) | What it is |
| ------------------------------ | ---------- |
| None | N/A |

---

## Dependencies

- **Blocked by / related ids:** `SCRUM-7`, `SCRUM-8`, `SCRUM-9`, `SCRUM-10`, `SCRUM-11`

## Out of scope

- Column reordering or custom custom-defined columns.
