# Story 08 — CRM-08: Knowledge Base Management with Search, Categories & Helpfulness Voting (Story: SCRUM-23)

---

## Prerequisites
* [Story 07 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-workspace/07-story-SCRUM-22.md): Agent workspace with canned responses.
* [Story 02 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-api/02-story-SCRUM-17.md): `/api/knowledge-base` endpoints.

---

## Story Goal
Deliver full bilingual Knowledge Base System matching PDF Feature 6:
1. **Article Search, Taxonomies & Tags ([`SCRUM-48`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-48)):**
   * Real-time search across English & Arabic titles, content, and tags.
   * Category filtering (`Getting Started`, `API & Integrations`, `Account & Billing`, `Troubleshooting`).
2. **Helpfulness Voting Counter ([`SCRUM-49`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-49)):**
   * Instant upvote/downvote buttons on articles calling `POST /api/knowledge-base/:slug/vote`.
   * Real-time counter increments (+42 / -1).
3. **Article Creation & Editing Modal ([`SCRUM-50`](https://ahmedosamaengineering.atlassian.net/browse/SCRUM-50)):**
   * Authoring modal with bilingual fields (English Title/Content, Arabic Title/Content, Slug, Category, Tags).
   * Submits to `POST /api/knowledge-base` and refreshes directory cache.

---

## Implementation Tasks

### 1 — API Client Methods
Add methods in `client/src/lib/api.ts`:
* `createKnowledgeArticle(data: any)`
* `voteKnowledgeArticle(slug: string, isHelpful: boolean)`

### 2 — Knowledge Base Modals & Components
* Create `client/src/components/knowledge/ArticleModal.tsx` (Article authoring modal).
* Create `client/src/components/knowledge/ArticleViewerModal.tsx` (Reader dialog with voting buttons).

### 3 — Knowledge Base Page Assembly
Update `client/src/app/knowledge-base/page.tsx`:
* Search header with hero banner.
* Category taxonomy chips.
* Article cards with tag badges, vote counts, and quick reader dialog.
* "+ Publish Article" button.

---

## Verification Steps
1. `npm run build` succeeds with 0 TypeScript/ESLint errors.
2. Verify searching and filtering articles by category.
3. Verify voting up/down increments counter in database.
4. Verify creating a new bilingual article displays immediately.
