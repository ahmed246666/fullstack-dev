# Story intake: SCRUM-11

- Folder: `.squad/stories/error-handling/SCRUM-11/intake.md`
- Tracker: Jira Cloud (`SCRUM`)

---

## Feature

- **Feature name (display):** End-to-End Error Handling & Toast Notifications
- **Feature slug (folder under `plans/`):** `error-handling`

## Tracker (metadata)

- **Tracker type:** `jira`
- **Work item id:** `SCRUM-11`
- **Work item type:** `Story`
- **Status:** `In Progress`
- **Labels:** `frontend, toast, notifications, error-handling, ux`

---

## Title

```
FS-W3-05: End-to-End Error Handling & Toast Notifications
```

---

## Description

```
Build a global, floating toast notification system in Next.js to provide non-blocking visual feedback for API actions (item created, item deleted, network disconnects, and server validation errors).
```

---

## Acceptance criteria

```markdown
1. Global `ToastProvider` context and `useToast()` hook:
   - Supports `success`, `error`, `info`, `warning` types.
   - Auto-dismisses after 4 seconds (configurable).
   - Dismiss button ("✕") on each toast card.
2. Floating Toast Container:
   - Positioned in bottom-right (or top-right) corner with slide-in & fade-out micro-animations.
   - Stacked vertically with z-index above modals and overlays.
3. Integration with App Actions:
   - Trigger success toast when item is created: "Item created successfully!".
   - Trigger success toast when item is deleted: "Item deleted successfully.".
   - Trigger error toast with clear message if delete or create API request fails.
4. Error Resilience:
   - Handles network dropouts and backend timeout errors gracefully without crashing the React tree.
5. Zero compilation errors, passes `npm run build`.
```

---

## Attachments

| File (relative to this folder) | What it is |
| ------------------------------ | ---------- |
| None | N/A |

---

## Dependencies

- **Blocked by / related ids:** `SCRUM-7` (Frontend Shell), `SCRUM-9` (List), `SCRUM-10` (Create Modal)
- **Depends on code areas:** `frontend/src/app/layout.tsx`, `frontend/src/components/ItemList.tsx`, `frontend/src/components/CreateItemModal.tsx`

## Out of scope

- Push notifications or web worker service workers.
