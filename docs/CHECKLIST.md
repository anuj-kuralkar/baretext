# Baretext MVP Checklist

This document tracks the implementation progress of the Baretext MVP against the [Product Requirements Document](./PRD-baretext.md).

## ✅ Completed (Infrastructure & Setup)
- [x] **Framework:** Next.js application structure initialized.
- [x] **Styling & Theming:** Tailwind CSS, Base-UI, and basic Shadcn UI (Button, ThemeProvider) configured.
- [x] **Database & ORM:** Drizzle ORM integrated with Neon (Serverless Postgres).
- [x] **Database Schema:** Initial schema for Authentication (`user`, `session`, `account`, `verification`) created and updated to Drizzle v1 Relations API.
- [x] **Authentication:** Better Auth initialized on both client and server side, including API route handlers.
- [x] **Environment Validation:** Type-safe environment variables configured using `@t3-oss/env-nextjs`.
- [x] **Tooling:** Biome configured for fast linting and formatting.

## 🚧 Pending (Application Features)

### 1. Data Model & Sync Engine
- [ ] Create `notes` schema in the database.
- [ ] Implement a local-first embedded database (e.g., RxDB, PGLite, or ElectricSQL) for zero-latency interactions.
- [ ] Implement CRDT (Collaborative/Conflict-free Replicated Data Types) text merging logic for seamless offline-to-online sync.
- [ ] Configure Service Worker / caching for complete offline functionality.

### 2. Authentication UI & Settings
- [ ] Build Login/Signup page with third-party providers (Google, GitHub).
- [ ] Build Settings Dashboard.
- [ ] Allow users to edit their display name and email.
- [ ] Display connected authentication methods.
- [ ] Implement secure logout functionality.

### 3. Core Application UI (Note Management)
- [ ] Build Main Dashboard to view a list of all notes.
- [ ] Implement instant note creation logic.
- [ ] Integrate a Rich Text Editor with basic formatting (bold, italic, bulleted lists).
- [ ] Add entry/exit CSS animations and View Transitions API for fluid navigation between the note list and settings.

### 4. Testing
- [ ] Write E2E Offline Behavior Test (simulate network disconnect, write, reconnect, assert sync).
- [ ] Write Integration Test for the sync engine's edge cases and data merging.
