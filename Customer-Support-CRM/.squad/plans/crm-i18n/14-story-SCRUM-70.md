# Technical Implementation Plan: Next-intl Dynamic Localization (`SCRUM-70`)

## 1. Architectural Summary
Implements comprehensive bilingual localization for AZM Customer Support CRM using `next-intl` v3+ and Next.js 15 App Router dynamic segments.

---

## 2. File Manifest
* [`client/src/i18n/routing.ts`](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/client/src/i18n/routing.ts): Routing definition (`locales: ['en', 'ar']`, `defaultLocale: 'en'`).
* [`client/src/i18n/request.ts`](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/client/src/i18n/request.ts): Request configuration resolving message catalogs for `next-intl`.
* [`client/src/middleware.ts`](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/client/src/middleware.ts): Edge middleware combining locale routing and cookie-based RBAC protection.
* [`client/src/messages/en.json`](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/client/src/messages/en.json): English message dictionary.
* [`client/src/messages/ar.json`](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/client/src/messages/ar.json): Arabic message dictionary.
* [`client/src/app/[locale]/layout.tsx`](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/client/src/app/%5Blocale%5D/layout.tsx): Root layout with `generateStaticParams`, globals CSS import, and RTL/LTR HTML wrappers.
* [`client/src/context/LanguageContext.tsx`](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/client/src/context/LanguageContext.tsx): Sync provider integrating `NextIntlClientProvider` with dynamic slug replacement.
* [`client/src/lib/api.ts`](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/client/src/lib/api.ts): Syncs `azm_crm_token` cookie for middleware inspection.
* [`client/src/components/layout/Sidebar.tsx`](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/client/src/components/layout/Sidebar.tsx): Exact path prefix matching preventing route highlighting collisions.

---

## 3. Verification & Validation
1. Build check via `npm run build` generates 21 static pages across `/en` and `/ar`.
2. Browser navigation verified for language toggle, cookie auth synchronization, and direct deep-linking.
