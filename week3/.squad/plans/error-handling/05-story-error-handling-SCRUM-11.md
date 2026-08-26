# Story 05 — End-to-End Error Handling & Toast Notifications (SCRUM-11)

- **Feature:** `error-handling`
- **Story Id:** `SCRUM-11`
- **Global Sequence:** 05
- **Status:** Ready for Execution
- **Stack:** Next.js, React Context, TypeScript, CSS Animations

---

## 1. Goal & Architecture Overview

Create a global, non-blocking toast notification system managed through React Context (`ToastContext.tsx`). The provider renders a floating container with slide-in animations for `success`, `error`, `info`, and `warning` feedback across all user actions (create, delete, network failures).

```
frontend/src/
├── context/
│   └── ToastContext.tsx        # React Context & useToast hook
└── app/
    └── layout.tsx              # Wrap app in ToastProvider
```

---

## 2. API Contract & Hook Signature

```typescript
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}
```

---

## 3. Implementation Tasks

- [ ] **Task 1: Toast Context & Provider** (`src/context/ToastContext.tsx`)
  - Create React Context with state array `toasts: ToastMessage[]`.
  - Provide `showToast()` and `removeToast()` functions.
  - Implement floating fixed container in bottom-right with auto-dismiss timers.
  - Add icons and styling for each toast type (`✅ success`, `❌ error`, `ℹ️ info`, `⚠️ warning`).

- [ ] **Task 2: Wrap Application Tree** (`src/app/layout.tsx`)
  - Add `<ToastProvider>` around `<main>` and children.

- [ ] **Task 3: Connect Toast Notifications to App Actions**
  - In `CreateItemModal.tsx`: Call `showToast('Item created successfully!', 'success')` on creation, and `showToast(error, 'error')` on failure.
  - In `ItemCard.tsx` / `ItemList.tsx`: Call `showToast('Item deleted successfully.', 'success')` on delete, and `showToast(error, 'error')` if delete fails.

- [ ] **Task 4: Build Verification**
  - Run `npm run build` in `frontend/`.

---

## 4. Verification Commands

```bash
cd frontend
npm run build
```
