# Story Intake: Next-intl Dynamic Localization & Edge Auth Protection

## Story ID: `SCRUM-70`
**Epic:** `crm-i18n`  
**Title:** Dynamic `[locale]` Slug Routing, Full `next-intl` Translation Catalogs, and Edge Middleware Route Protection

---

## 1. Objectives & Business Context
* Transition the entire frontend architecture to Next.js 15 dynamic locale slug routing `/[locale]` (`/en` and `/ar`).
* Guarantee 100% Arabic and English localization across all pages, forms, modals, tables, badges, and empty states.
* Implement Next.js edge middleware for automatic language detection, default locale redirect (`/` -> `/en` or `/ar`), and cookie-backed route protection on `/workspace`, `/tickets`, `/customers`, and `/analytics`.
* Ensure smooth, synchronized bi-directional slug switching (`/en/analytics` <-> `/ar/analytics`) with RTL/LTR layout transitions and brand typography (`El Messiri` + `Plus Jakarta Sans`).

---

## 2. Scope & Key Deliverables
1. **Dynamic App Router Structure (`client/src/app/[locale]/`)**:
   * Root layout with `generateStaticParams` for `['en', 'ar']`, global CSS styling import, and `dir="rtl"|"ltr"`.
   * Migration of Dashboard, Tickets, Kanban, Workspace, Customer 360, Knowledge Base, Analytics, Login, and Portal under `/[locale]`.
2. **Next-intl Configuration & Message Catalogs**:
   * `client/src/i18n/routing.ts` & `client/src/i18n/request.ts`.
   * Complete English (`en.json`) and Arabic (`ar.json`) message catalogs.
3. **Edge Middleware (`client/src/middleware.ts`)**:
   * `next-intl` middleware pipeline combined with cookie-based token validation (`azm_crm_token`).
   * Protection for administrative and agent workspaces with redirect preserving query strings.
4. **Context & API Synchronization**:
   * Update `setAuthToken` in `client/src/lib/api.ts` to sync both `localStorage` and `document.cookie`.
   * Update `LanguageContext.tsx` and `Sidebar.tsx` for unambiguous route highlighting.

---

## 3. Acceptance Criteria
* [x] Next.js builds all 21 localized route permutations cleanly with 0 TypeScript/ESLint errors.
* [x] Language toggle instantly switches URL slug, document direction (`dir`), and all UI text strings.
* [x] Protected routes redirect unauthenticated users to `/${locale}/login?redirect=...`.
* [x] Active sidebar items resolve without collision (e.g. `/tickets/kanban` highlights only Kanban).
