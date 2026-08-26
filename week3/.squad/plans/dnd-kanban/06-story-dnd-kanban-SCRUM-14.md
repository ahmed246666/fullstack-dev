# Story 06 — Drag and Drop Kanban Board using @dnd-kit (SCRUM-14)

- **Feature:** `dnd-kanban`
- **Story Id:** `SCRUM-14`
- **Global Sequence:** 06
- **Status:** Ready for Execution
- **Stack:** Node.js/Express, SQLite, Next.js, `@dnd-kit/core`, `@dnd-kit/sortable`, TypeScript

---

## 1. Goal & Architecture Overview

Introduce a full Kanban Drag and Drop board experience powered by `@dnd-kit`. Users can drag items across `Pending`, `In Progress`, and `Completed` columns. Status updates are persisted in SQLite via a new backend `PATCH /api/items/:id/status` endpoint with optimistic frontend updates and failure rollbacks.

```
week3/
├── backend/
│   ├── src/
│   │   ├── services/itemService.js      # Add updateItemStatus(id, status)
│   │   ├── controllers/itemController.js# Add updateItemStatus controller
│   │   └── routes/itemRoutes.js         # Map PATCH /:id/status
│   └── tests/api.test.js                # Test PATCH endpoint
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── KanbanBoard.tsx          # DndContext container & columns
    │   │   ├── KanbanColumn.tsx         # Droppable column
    │   │   └── KanbanCard.tsx           # Draggable item card
    │   ├── lib/api.ts                   # Add updateItemStatus(id, status)
    │   └── app/page.tsx                 # Grid vs. Kanban view switch
    └── package.json                     # Add @dnd-kit dependencies
```

---

## 2. API Contract for Status Update

### `PATCH /api/items/:id/status`
* **Request Body:**
  ```json
  {
    "status": "completed"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Item status updated",
    "data": {
      "id": 1,
      "title": "...",
      "status": "completed",
      "createdAt": "..."
    }
  }
  ```

---

## 3. Implementation Tasks

- [ ] **Task 1: Backend PATCH Endpoint**
  - In `backend/src/services/itemService.js`: Add `updateItemStatus(id, status)`.
  - In `backend/src/controllers/itemController.js`: Add `updateItemStatus` handler validating status.
  - In `backend/src/routes/itemRoutes.js`: Register `router.patch('/:id/status', itemController.updateItemStatus)`.
  - In `backend/tests/api.test.js`: Add automated test for `PATCH /api/items/:id/status`.

- [ ] **Task 2: Frontend Dependencies & API Client**
  - Install `@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities` in `frontend/`.
  - In `frontend/src/lib/api.ts`: Add `updateItemStatus(id, status)` function.

- [ ] **Task 3: Kanban Components with @dnd-kit**
  - `KanbanCard.tsx`: Draggable card using `useDraggable` or `useSortable`.
  - `KanbanColumn.tsx`: Droppable column container using `useDroppable`.
  - `KanbanBoard.tsx`: Top-level `DndContext` handling `onDragEnd`, sensory pointer/keyboard activation, optimistic column state updates, and toast feedback.

- [ ] **Task 4: View Toggle in UI**
  - In `frontend/src/components/ItemList.tsx` / `frontend/src/app/page.tsx`: Add a clean view mode toggle button ("Grid" vs "Kanban").

- [ ] **Task 5: Verification & Build**
  - Run `npm test` in backend.
  - Run `npm run build` in frontend.

---

## 4. Verification Commands

```bash
cd backend && npm test
cd ../frontend && npm run build
```
