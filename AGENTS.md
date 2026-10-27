# Baretext Agent Context

## Architecture
Baretext is a Bun workspace monorepo (`apps/web`, `apps/api`, `packages/*`).
- **Web**: Next.js frontend with Lexical (Yjs) editor, synchronized via ElectricSQL and TanStack DB.
- **API**: ElysiaJS backend.
- **Data**: Neon Postgres, Drizzle ORM, Upstash Redis.
- **Auth**: Better Auth.

## Rules
- **Environment**: Read `package.json` for dependency versions and workspace commands.
- **Formatting**: Run `biome` scripts defined in the root `package.json` for linting.
- **Testing**: Run tests using `bun run test` (Vitest), not bare `bun test`.
- **React Compiler**: The React Compiler is active. NEVER use `useMemo`, `useCallback`, or `React.memo()`. Write standard inline functions and objects; rely on the compiler for optimization.
- **Sync & Offline**: We use ElectricSQL and TanStack DB. You MUST read https://electric-sql.com/AGENTS.md for general information on developing with Electric and TanStack DB.

## Agent skills

### Issue tracker

GitHub is used as the issue tracker. See `docs/agents/issue-tracker.md`.

### Triage labels

The default triage labels are used (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout (one `GLOSSARY.md` at the root). See `docs/agents/domain.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
