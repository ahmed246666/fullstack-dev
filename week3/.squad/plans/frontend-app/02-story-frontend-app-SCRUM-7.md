# Story 02 — Setup Next.js Frontend Application with TypeScript & Design System (SCRUM-7)

- **Feature:** `frontend-app`
- **Story Id:** `SCRUM-7`
- **Global Sequence:** 02
- **Status:** Ready for Execution
- **Stack:** Next.js (App Router), React 19/18, TypeScript, Vanilla CSS Design System

---

## 1. Goal & Architecture Overview

Scaffold a high-performance Next.js application inside the `frontend/` directory with full TypeScript support, App Router architecture, a premium design system, shared TypeScript data models, and a centralized API client layer to consume the Express backend API.

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root HTML & body shell with font & navbar
│   │   ├── page.tsx              # Home landing & dashboard entry point
│   │   └── globals.css           # Core design system tokens & utilities
│   ├── components/
│   │   ├── Navbar.tsx            # Navigation header with backend status badge
│   │   ├── Footer.tsx            # Application footer
│   │   └── StatusBadge.tsx       # Live backend connection indicator
│   ├── lib/
│   │   └── api.ts                # Typed fetch client with error handling
│   └── types/
│       └── item.ts               # Shared TypeScript models and API interfaces
├── public/                       # Static assets
├── .env.local                    # Local environment variables
├── .env.example                  # Template environment file
├── tsconfig.json                 # TypeScript compiler configuration
├── next.config.js                # Next.js configuration
└── package.json                  # Next.js dependencies and scripts
```

---

## 2. Shared Data Models & Contracts (`src/types/item.ts`)

```typescript
export type ItemStatus = 'pending' | 'in-progress' | 'completed';

export interface Item {
  id: number;
  title: string;
  description: string | null;
  status: ItemStatus;
  createdAt: string;
}

export interface CreateItemPayload {
  title: string;
  description?: string;
  status?: ItemStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  errors?: string[];
}
```

---

## 3. Implementation Tasks

- [ ] **Task 1: Package Scaffolding & Config**
  - Create `frontend/package.json` with `next`, `react`, `react-dom`, `typescript`, `@types/node`, `@types/react`, `@types/react-dom`.
  - Configure `tsconfig.json` with path alias `@/*` pointing to `./src/*`.
  - Create `frontend/next.config.js`.
  - Create `.env.local` and `.env.example` with `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.

- [ ] **Task 2: Type Definitions** (`src/types/item.ts`)
  - Export `Item`, `ItemStatus`, `CreateItemPayload`, and `ApiResponse<T>`.

- [ ] **Task 3: Centralized API Client** (`src/lib/api.ts`)
  - Implement `fetchItems()`, `fetchItemById(id)`, `createItem(payload)`, `deleteItem(id)`, and `checkBackendHealth()`.
  - Include error propagation with informative error messages.

- [ ] **Task 4: Design System & Styling** (`src/app/globals.css`)
  - CSS custom properties (variables) for modern dark theme: background `#090d16`, card surface `#111827`, border `#1f293d`, brand gradient `#6366f1` to `#a855f7`, text colors, status colors (emerald for completed, amber for pending, blue for in-progress).
  - Modern reset, Inter font stack, reusable utility classes (`.btn-primary`, `.btn-secondary`, `.card`, `.badge`, `.input`, `.skeleton`).

- [ ] **Task 5: Core Layout & Navigation**
  - `src/components/Navbar.tsx`: Brand logo, navigation links, and real-time backend health check badge.
  - `src/components/Footer.tsx`: Footer with tech stack info.
  - `src/app/layout.tsx`: Root HTML, metadata, navbar, main wrapper, footer.
  - `src/app/page.tsx`: Welcome dashboard placeholder ready for list screen.

- [ ] **Task 6: Verification & Build Check**
  - Run `npm run build` inside `frontend/` to confirm zero TypeScript compilation errors.

---

## 4. Verification Commands

```bash
cd frontend
npm run build
npm run dev
```
