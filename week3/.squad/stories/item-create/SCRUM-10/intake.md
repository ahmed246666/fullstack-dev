# Story intake: SCRUM-10

- Folder: `.squad/stories/item-create/SCRUM-10/intake.md`
- Tracker: Jira Cloud (`SCRUM`)

---

## Feature

- **Feature name (display):** Item Creation & Form Validation
- **Feature slug (folder under `plans/`):** `item-create`

## Tracker (metadata)

- **Tracker type:** `jira`
- **Work item id:** `SCRUM-10`
- **Work item type:** `Story`
- **Status:** `In Progress`
- **Labels:** `frontend, nextjs, react, forms, validation`

---

## Title

```
FS-W3-04: Item Creation Modal/Form with Real-Time Validation
```

---

## Description

```
Build interactive item creation modal with controlled form inputs (title, description, status), real-time client-side validation messages, loading button states, server error handling, and immediate list refresh upon success.
```

---

## Acceptance criteria

```markdown
1. `CreateItemModal` component opens via "New Item" button on header/page.
2. Controlled Form Fields:
   - `title`: Required text input.
   - `description`: Optional multi-line textarea.
   - `status`: Select dropdown with options: 'pending', 'in-progress', 'completed'.
3. Real-Time Client-Side Validation:
   - Displays inline error if `title` is empty or less than 3 characters.
   - Input border changes to danger red (`.input-error`) when invalid.
   - Disables or blocks submit button until validation requirements are met.
4. Loading & UX Feedback:
   - Submit button enters loading state ("Creating...") during API request.
   - Escape key or backdrop click closes modal cleanly.
   - Fields reset on successful submission.
5. Integration:
   - Sends `POST /api/items` via `createItem()` in `api.ts`.
   - Triggers live refresh in `ItemList` immediately on success.
6. Zero compilation errors, passes `npm run build`.
```

---

## Attachments

| File (relative to this folder) | What it is |
| ------------------------------ | ---------- |
| None | N/A |

---

## Dependencies

- **Blocked by / related ids:** `SCRUM-7` (Frontend Setup), `SCRUM-8` (Backend API), `SCRUM-9` (Items List)
- **Depends on code areas:** `frontend/src/lib/api.ts`, `frontend/src/components/ItemList.tsx`

## Out of scope

- Multi-step wizard forms.
