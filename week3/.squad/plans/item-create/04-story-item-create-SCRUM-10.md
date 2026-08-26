# Story 04 — Item Creation Modal/Form with Real-Time Validation (SCRUM-10)

- **Feature:** `item-create`
- **Story Id:** `SCRUM-10`
- **Global Sequence:** 04
- **Status:** Ready for Execution
- **Stack:** Next.js (App Router), React 19/18, TypeScript, CSS Design Tokens

---

## 1. Goal & Architecture Overview

Create a modal dialog component (`CreateItemModal.tsx`) featuring controlled form inputs with real-time field validation, error highlights, loading state feedback, and instant state synchronization with the item list view.

```
frontend/src/components/
└── CreateItemModal.tsx      # Modal dialog with validation, fields, and submit handler
```

---

## 2. Validation Logic & State Design

### 2.1 Form State
```typescript
interface FormState {
  title: string;
  description: string;
  status: ItemStatus;
}

interface FormErrors {
  title?: string;
  general?: string;
}
```

### 2.2 Client-Side Validation Rules
1. `title.trim().length === 0` $\rightarrow$ `"Title is required"`
2. `title.trim().length < 3` $\rightarrow$ `"Title must be at least 3 characters long"`
3. If validation fails, highlight input with `.input-error` class and display message in red below field.

---

## 3. Implementation Tasks

- [ ] **Task 1: Modal Backdrop & Layout** (`src/components/CreateItemModal.tsx`)
  - Render dark backdrop with blur, centered card container, header with close button ("✕"), and footer actions.
  - Listen for `keydown` Escape to close.

- [ ] **Task 2: Controlled Form & Validation**
  - Controlled inputs for `title`, `description`, and `status`.
  - Validate on blur and change.

- [ ] **Task 3: API Integration & Submit Handler**
  - Call `createItem({ title, description, status })` from `src/lib/api.ts`.
  - Handle loading button state ("Creating...").
  - On error, display server validation message in top error banner.
  - On success, reset form, trigger `onSuccess()` callback, and close modal.

- [ ] **Task 4: Wire into Page & ItemList** (`src/app/page.tsx`)
  - Add state `isCreateModalOpen`.
  - Pass `onOpenCreateModal` to `ItemList` and render `CreateItemModal`.
  - Increment `refreshTrigger` upon item creation to reload items list automatically.

- [ ] **Task 5: Verification & Build Check**
  - Run `npm run build` to ensure 0 errors.

---

## 4. Verification Commands

```bash
cd frontend
npm run build
```
