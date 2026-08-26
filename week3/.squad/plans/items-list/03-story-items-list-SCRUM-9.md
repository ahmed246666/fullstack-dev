# Story 03 — Responsive Items List Screen with Loading Skeletons & Error State (SCRUM-9)

- **Feature:** `items-list`
- **Story Id:** `SCRUM-9`
- **Global Sequence:** 03
- **Status:** Ready for Execution
- **Stack:** Next.js (App Router), React 19/18, TypeScript, CSS Design Tokens

---

## 1. Goal & Architecture Overview

Create a production-grade items list view that fetches items from the Node.js/Express backend API (`GET /api/items`), handles all lifecycle states (loading shimmer, error with retry, empty state, and loaded grid), provides real-time search & status filtering, and allows single-click deletion.

```
frontend/src/components/
├── ItemList.tsx            # Main client controller with state, search, and filter tabs
├── ItemCard.tsx            # Individual item presentation card with status badge & delete action
├── SkeletonLoader.tsx      # Multi-card shimmer skeleton placeholder
├── EmptyState.tsx          # No items found visual state
└── ErrorAlert.tsx          # API connection error card with retry button
```

---

## 2. Component Design & Contracts

### 2.1 State Management in `ItemList.tsx`
* `items: Item[]` — Raw fetched list from API.
* `isLoading: boolean` — Initial loading indicator.
* `error: string | null` — Holds API error message if fetch fails.
* `searchQuery: string` — Text search query for filtering.
* `activeTab: 'all' | ItemStatus` — Active tab filter.

### 2.2 Filter Logic
```typescript
const filteredItems = items.filter(item => {
  const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
  const matchesTab = activeTab === 'all' || item.status === activeTab;
  return matchesSearch && matchesTab;
});
```

---

## 3. Implementation Tasks

- [ ] **Task 1: SkeletonLoader Component** (`src/components/SkeletonLoader.tsx`)
  - Render a grid of 3 placeholder cards with pulsating shimmer headers, bodies, and badges.

- [ ] **Task 2: ErrorAlert Component** (`src/components/ErrorAlert.tsx`)
  - Render an alert card with danger icon, clear explanation, and a "Retry" button that calls the refetch callback.

- [ ] **Task 3: EmptyState Component** (`src/components/EmptyState.tsx`)
  - Render visual placeholder with informative message when search yields 0 results or database is empty.

- [ ] **Task 4: ItemCard Component** (`src/components/ItemCard.tsx`)
  - Render item card: title, description, formatted date, colored status pill badge, and delete button with loading state.

- [ ] **Task 5: ItemList Container Component** (`src/components/ItemList.tsx`)
  - Client component with `useEffect` invoking `fetchItems()`.
  - Search input with clear button.
  - Category tabs (`All`, `Pending`, `In Progress`, `Completed`) with live counts.
  - Delete handler calling `deleteItem(id)` and updating local state immediately.

- [ ] **Task 6: Wire into Main Page** (`src/app/page.tsx`)
  - Replace placeholder section with the `ItemList` component.

- [ ] **Task 7: Build & Verification**
  - Run `npm run build` in `frontend/` to ensure zero compilation or type errors.

---

## 4. Verification Commands

```bash
cd frontend
npm run build
```
