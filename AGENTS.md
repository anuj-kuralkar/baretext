# Baretext Agent Context

Bun workspace monorepo (`apps/web`, `apps/api`, `packages/*`, `tests`). Read root `package.json` for dependencies and workspace scripts.

## Architecture Boundaries

- **Web (`apps/web`)**: Next.js + React Compiler + Lexical (`yjs`) + TanStack DB. Write plain inline functions and objects; rely on the React Compiler instead of `useMemo`, `useCallback`, or `React.memo()`.
- **API (`apps/api`)**: ElysiaJS backend separated from Next.js. Export `app` and `type App` from `src/app.ts`; keep `app.listen()` isolated in `src/index.ts`.
- **Sync (hybrid per ADR-0005)**: Note metadata syncs via Neon Realtime sealed queries; Yjs document sync remains on the Electric shape proxy (`apps/api/src/routes/shape`). When adding or modifying synced entities, follow ADR-0005 and https://electric-sql.com/AGENTS.md.
- **Data & Auth (`packages/db`, `packages/auth`)**: Neon Postgres + Drizzle ORM, Upstash Redis, Better Auth.

## Tight Verification Loop

Use AI-efficient reporters to keep command output compact and actionable:

- **Typecheck**: `bun check` (runs `tsc --noEmit` across every workspace package)
- **Format**: `bun fmt` (`biome format --write --reporter=concise .`) or `bun fmt:check`
- **Lint**: `bun lint` (`biome lint --reporter=concise .`)
- **Unit tests**: `bun run test:unit -- --reporter=agent` (always run Vitest via `bun run`, never bare `bun test`)
- **Coverage**: `bun run test:coverage -- --reporter=agent` (80% threshold gate; currently below threshold as tracked tech debt)
- **E2E tests**: `bun run test:e2e -- --reporter=line` (Playwright in `tests/e2e` on an ephemeral Neon branch)

Before finishing any code change, run `bun check`, `bun lint`, `bun fmt`, and `bun run test:unit -- --reporter=agent` cleanly; run `bun run test:e2e -- --reporter=line` whenever changes span auth, DB schema, API contracts, or end-to-end UI flows.

## Testing Reference

Read [`docs/agents/testing.md`](docs/agents/testing.md) before writing or updating unit tests, Elysia route tests, Better Auth tests, coverage checks, or Playwright E2E tests.

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
