# Story 12 — CRM-12: Phase 2 Enterprise Workflows (File Attachments, KB Authoring, SLA Auto-Assignment & Agent Tasks) (Story: SCRUM-64)

---

## Status: Completed (Verified & Deployed)

## Prerequisites
* [Story 11 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-rbac/11-story-SCRUM-58.md): Enterprise JWT Authentication & RBAC.
* [Story 08 completed](file:///c:/Users/user/Desktop/Projects%20AZM/fullstack/fullstack-dev/Customer-Support-CRM/.squad/plans/crm-kb/08-story-SCRUM-23.md): Knowledge Base Directory & Taxonomies.

---

## Story Goal
Fulfill Phase 2 Core PDF Requirements:
1. **File Attachments Pipeline (Requirements 1, 2, 8):**
   * Express multipart upload pipeline (`multer`) mounted at `POST /api/upload`.
   * Static asset hosting for `/uploads`.
   * Database `Attachment` model linked to `Ticket` and `Note` records.
   * Universal `FileUploadZone.tsx` component with drag-and-drop, upload progress, file preview, and deletion.
   * Integrated across Ticket Drawer, Agent Workspace, and Customer Portal.
2. **Knowledge Base Article Management (Requirement 6):**
   * Backend endpoints: `POST /api/knowledge-base`, `PUT /api/knowledge-base/:id`, `DELETE /api/knowledge-base/:id` (RBAC: `ADMIN`, `AGENT`).
   * Authoring modal `ArticleEditorModal.tsx` for creating and editing bilingual guides.
3. **SLA Automatic Agent Assignment (Requirement 5):**
   * Automatic least-busy active agent allocation on ticket creation when no agent is manually specified.
4. **Agent Tasks & Action Reminders (Requirement 4):**
   * Interactive task checklist widget `AgentTasksWidget.tsx` embedded in `/workspace` for personal agent reminders.

---

## Verification Summary
* `server`: `npm run build` succeeds with 0 TypeScript errors.
* `client`: `npm run build` generates all 12 static routes cleanly with 0 ESLint/TypeScript errors.
