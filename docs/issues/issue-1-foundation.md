---
title: "Issue 1: Foundation (Next.js, Neon, Drizzle)"
labels: ["ready-for-agent"]
---

# Issue 1: Foundation

## Goal
Scaffold the clean Next.js application and set up the fundamental database connection using Neon Postgres and Drizzle ORM.

## Acceptance Criteria
- [ ] Next.js App Router project initialized. Ensure all project dependencies (Next.js, React, Drizzle, etc.) are installed at their absolute latest versions.
- [ ] Drizzle ORM configured with Neon Postgres. Use `@neondatabase/serverless` for edge/serverless or `pg` pool for long-running processes.
- [ ] Initial database schema created for auth, `notes`, and `ydoc_updates` (all application tables synced to clients must be designed with `REPLICA IDENTITY FULL`).
- [ ] Local `.env` configured with `DATABASE_URL`.
- [ ] Biome configured for linting/formatting.
- [ ] Lefthook initialized for pre-commit hooks (running Biome).
- [ ] A basic Vitest test confirming Drizzle schema loads correctly.
