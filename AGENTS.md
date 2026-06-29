# Baretext AI Agent Guidelines

## Project Overview

**Baretext** is a simple place to write, organize, and revisit your notes. Easy to get started with, comfortable to use every day.

- **Repository:** [github.com/anuj-kuralkar/baretext](https://github.com/anuj-kuralkar/baretext)
- **Web:** [baretext.app](https://baretext.app)

## Tech Stack

> **Note:** Always check `package.json` for the current installed version of these dependencies and ensure you use that exact version.

- **Framework:** Next.js
- **Language:** TypeScript
- **Authentication:** Better Auth (uses `@alde/ba-surreal` adapter for SurrealDB)
- **Database:** SurrealDB
- **Cache/Redis:** Upstash Redis
- **Storage:** Vercel Blob
- **UI & Styling:** Tailwind CSS, Ark UI, shadcn, Lucide React
- **Rich Text Editor:** Lexical
- **Emails:** React Email & Resend
- **Tooling & Code Quality:** Biome (linting/formatting), Lefthook, Commitlint

## Scripts

Below are the available scripts and their purposes:

- `bun dev`: Starts the Next.js development server.
- `bun build`: Builds the Next.js application for production.
- `bun start`: Starts the Next.js production server.
- `bun lint`: Runs the Biome linter and automatically fixes issues (`biome lint --write .`). MUST be used for linting instead of ESLint.
- `bun format`: Runs the Biome formatter and automatically formats code (`biome format --write .`). MUST be used for formatting instead of Prettier.
- `bun email:dev`: Starts the React Email development server to preview templates.

## Agent Rules

<!-- BEGIN:nextjs-agent-rules -->

### Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->
