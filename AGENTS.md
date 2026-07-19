# Project Overview

**Baretext** is a simple place to write, organize, and revisit your notes. Easy to get started with, comfortable to use every day.

- **Repository:** [github.com/anuj-kuralkar/baretext](https://github.com/anuj-kuralkar/baretext)
- **Web:** [baretext.app](https://baretext.app)

# Tech Stack

> **Note:** Always check `package.json` for the current installed version of these dependencies and ensure you use that exact version.

- **Framework:** Next.js
- **Language:** TypeScript
- **Authentication:** Better Auth
- **Database:** Neon (Serverless Postgres)
- **ORM:** Drizzle ORM
- **Sync & DB:** ElectricSQL, TanStack DB
- **Cache/Redis:** Upstash Redis
- **UI & Styling:** Tailwind CSS, Base UI, shadcn, Lucide React
- **Rich Text Editor:** Lexical (with Yjs for real-time collaboration)
- **Tooling & Code Quality:** Biome (linting/formatting), Lefthook
- **Testing:** Vitest, @vitest/browser-playwright, vitest-browser-react

# Scripts

Below are the available scripts and their purposes:

- `bun dev`: Starts the Next.js development server.
- `bun build`: Builds the Next.js application for production.
- `bun start`: Starts the Next.js production server.
- `bun lint`: Runs the Biome linter (`biome check`). MUST be used for linting.
- `bun format`: Runs the Biome formatter and automatically formats code (`biome format --write`). MUST be used for formatting.
- `bun test:browser`: Runs the browser tests using Vitest.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
