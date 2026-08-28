# Project Overview

**Baretext** is a simple place to write, organize, and revisit your notes. Easy to get started with, comfortable to use every day.

- **Repository:** [github.com/anuj-kuralkar/baretext](https://github.com/anuj-kuralkar/baretext)
- **Web:** [baretext.app](https://baretext.app)

# Tech Stack

> **Note:** Always check `package.json` for the current installed version of these dependencies and ensure you use that exact version.

- **Framework:** Next.js
- **Language:** TypeScript
- **API Framework:** ElysiaJS
- **Schema Validation:** Zod
- **Authentication:** Better Auth
- **Database:** Neon (Serverless Postgres)
- **ORM:** Drizzle ORM
- **Sync & DB:** ElectricSQL, TanStack DB
- **Cache/Redis:** Upstash Redis
- **UI & Styling:** Tailwind CSS, Base UI, shadcn, Lucide React
- **Rich Text Editor:** Tiptap (with Yjs for real-time collaboration)
- **Tooling & Code Quality:** Biome (linting/formatting), Lefthook
- **Testing:** Vitest, @vitest/browser-playwright, vitest-browser-react

# Scripts

Below are the available scripts and their purposes:

# Scripts

- `bun dev:api`: Starts the API dev server in watch mode.
- `bun dev:web`: Starts the web app in dev mode.
- `bun build:web`: Builds the web app for production.
- `bun check`: Runs Biome formatting and lint checks. **MUST** be used for linting and formatting.
- `bun check:write`: Runs Biome checks and automatically applies safe fixes. **MUST** be used to fix lint and formatting issues.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:electricsql-agent-rules -->

You MUST read https://electric-sql.com/AGENTS.md for general information on developing wth Electric and TanStack DB.
<!-- END:electricsql-agent-rules -->
