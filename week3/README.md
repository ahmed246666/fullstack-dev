# 🚀 Week 3: Full-Stack Integration & Spec-Driven Development (SDD)

> **AZM Squad — Company Technology Development Program**  
> **Participant:** Ahmed Osama  
> **Core Stack:** Node.js · Express.js · Next.js (TypeScript) · Squad-Kit SDD · Jira Cloud

---

## 📌 Project Overview

This repository houses the **Week 3 Full-Stack Deliverable** for the Company Technology Development Program. The project demonstrates an end-to-end full-stack web application connecting a robust **Node.js/Express REST API** backend with a modern, responsive **Next.js (App Router + TypeScript)** frontend, developed under the **Spec-Driven Development (SDD)** workflow powered by [Squad-Kit](https://squad-kit.com/).

---

## 🏗️ Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────┐
│                   FULL-STACK SYSTEM                    │
├──────────────────────────┬─────────────────────────────┤
│   FRONTEND (Next.js)     │     BACKEND (Node.js/Express)│
│                          │                             │
│ • Next.js + App Router   │ • Express.js REST API       │
│ • TypeScript (Type-safe) │ • Controllers & Services    │
│ • Responsive UI          │ • Validation Middleware     │
│ • Skeletons & Spinners   │ • CORS & Security Headers   │
│ • Client Validation      │ • Error Handling Pipeline   │
│ • Toast Notifications    │ • SQLite DB (dev.db)        │
└──────────────────────────┴─────────────────────────────┘
                             ▲
                             │ REST API (JSON / HTTP)
                             ▼
```

### 🛠️ Tech Stack Details

* **Frontend:** Next.js, React, TypeScript, CSS / Component Styling
* **Backend:** Node.js, Express.js, CORS, Dotenv
* **Database:** SQLite (Embedded single-file database)
* **SDD & AI Orchestration:** [Squad-Kit](https://squad-kit.com/) (`v0.12.x`)
* **Project Management & Agile Tracking:** Jira Cloud (`SCRUM` Board)

---

## ✨ Key Features & Capabilities

### 1. 📋 Dynamic Listing & Data Display
* **Collection View:** Clean display of items/resources with detailed attributes.
* **Loading Skeletons:** Polished skeleton loaders to eliminate jarring layout shifts.
* **Empty & Error States:** Informative fallback cards when no data is found or when the backend is unreachable.

### 2. 📝 Interactive Creation Form & Real-time Validation
* **Controlled Inputs:** Real-time feedback with client-side field validation.
* **Error Highlighting:** Inline validation messages for missing/invalid fields.
* **Optimistic / Immediate Refresh:** Instantly synchronizes newly created entries with the list view.

### 3. 🛡️ Robust End-to-End Error Handling
* **Standardized API Error Responses:** Consistent JSON envelope for errors (`{ success: false, message, errors }`).
* **Toast & Alert Notifications:** User-friendly popups for network failures and validation errors.

### 4. ⚡ Spec-Driven Development (SDD) Workflow
* **Plan Once, Execute Cheap:** Every feature follows a structured 3-phase cycle (Intake $\rightarrow$ Plan $\rightarrow$ Execution).
* **Direct Jira Integration:** Automatic intake generation fetching Jira issues, summaries, and acceptance criteria.
* **Antigravity Slash Command:** Built-in `.gemini/commands/squad-plan.toml` for seamless `/squad-plan` execution.

---

## 📁 Repository Structure

```text
week3/
├── .gemini/
│   └── commands/
│       └── squad-plan.toml      # Antigravity slash command definition
├── .squad/
│   ├── config.yaml              # Squad-Kit workspace config (Jira & TypeScript)
│   ├── secrets.yaml             # Local Jira tracker credentials (git-ignored)
│   ├── stories/                 # Story intake folders and requirements
│   └── plans/                   # Concrete SDD implementation plans
├── .env                         # Environment variables & Jira configuration
├── jira.js                      # Jira automation CLI tool
├── README.md                    # Project documentation
├── backend/                     # Express.js REST API service (to be scaffolded)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
└── frontend/                    # Next.js Application (to be scaffolded)
    ├── src/
    │   ├── app/
    │   ├── components/
    │   └── types/
    └── package.json
```

---

## 🎯 Jira Agile Board Integration

All user stories and tasks for Week 3 are tracked on Jira:
* **Board:** [SCRUM Board](https://ahmedosamaengineering.atlassian.net/jira/software/projects/SCRUM/boards/1)
* **Epic:** `SCRUM-6` (*Week 3: Full-Stack Next.js & Express Integration Epic*)

### CLI Helper Commands

Manage your Jira tickets directly from your terminal:

```bash
# List all active issues
node jira.js list

# Create a new Story, Task, or Bug
node jira.js create "Ticket Summary" "Detailed description" Story

# Move ticket status
node jira.js transition SCRUM-7 "In Progress"
node jira.js transition SCRUM-7 "Done"
```

---

## 🔄 SDD (Spec-Driven Development) Workflow

We use **Squad-Kit** for all feature implementations:

1. **Step 1 — Story Intake:**
   ```bash
   npx squad-kit new-story <feature-slug> --id SCRUM-7
   ```
   *Fetches title, description, and requirements directly from Jira.*

2. **Step 2 — Generate Concrete Plan:**
   * Run `/squad-plan .squad/stories/<feature-slug>/<id>/intake.md` in the chat.
   * Generates a concrete implementation plan with exact file paths, interfaces, and test steps.

3. **Step 3 — Execute & Build:**
   * Implement code directly against the generated plan file.

---

## 📋 Week 3 Deliverables Checklist

- [x] Jira project connected & configured with automation CLI
- [x] Squad-Kit SDD initialized (`.squad/config.yaml`, `/squad-plan` command)
- [x] Express backend API endpoints with SQLite (`GET /items`, `POST /items`, `PATCH /items/:id/status`) [SCRUM-8 DONE]
- [x] Next.js Frontend Scaffolding, TypeScript & Design System [SCRUM-7 DONE]
- [x] Items List Screen with Loading Skeletons & Empty States [SCRUM-9 DONE]
- [x] Item Creation Form & Client-Side Validation [SCRUM-10 DONE]
- [x] End-to-end Error Handling & Toast Notifications [SCRUM-11 DONE]
- [x] Drag-and-Drop Kanban Board with @dnd-kit [SCRUM-14 DONE]
