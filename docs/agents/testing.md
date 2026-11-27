# Testing Guide

Every test targets observable behavior through public contracts, never internal implementation details or mocked auth clients.

## Colocated Unit Tests (Vitest + React Testing Library)

- Colocate unit tests beside source files as `*.test.ts` or `*.test.tsx` inside `apps/*/src` and `packages/*/src`.
- Run all unit projects with `bun run test:unit -- --reporter=agent` (always `bun run`, never bare `bun test`), or scope with `--project=<name>-unit` (`api-unit`, `web-unit`, `auth-unit`, `db-unit`, `emails-unit`).
- Test `apps/web` UI components in `happy-dom` with `@testing-library/react` (`render`, `screen`, `userEvent`). Query by accessible role or label and assert rendered DOM state.

## Elysia Route & Service Tests (`apps/api`)

- Import `app` from `src/app.ts` without starting a port (`app.listen()` stays in `src/index.ts`).
- Exercise HTTP routes with `app.handle(new Request("http://localhost/...", init))` — always construct `Request` with an absolute URL — or `treaty(app)` from `@elysia/eden` for typed assertions.
- Await `await app.modules` before `app.handle()` when testing routes registered via async plugins.
- Test pure business helpers directly; test route contracts for schema validation (`422`), auth rejection (`401`), headers, and status codes.

## Auth Testing (`@baretext/auth/test`)

- Import `testAuth` from `@baretext/auth/test` (`packages/auth/src/test.ts`), which enables `testUtils({ captureOTP: true })` and an in-memory email sender while keeping `testUtils` out of production `@baretext/auth`.
- Access helpers via `const { test } = await testAuth.$context`:
  - **Factories & DB**: `test.createUser()`, `test.saveUser(user)`, `test.deleteUser(user.id)`
  - **API sessions**: `test.getAuthHeaders({ userId })` or `test.login({ userId })`
  - **Playwright sessions**: `test.getCookies({ userId, domain: "localhost" })` passed to `context.addCookies(cookies)`
  - **OTP capture**: `test.clearOTPs()` in `beforeEach`, then `test.getOTP(email)` after triggering `sendVerificationOTP`
- Keep `authClient` and session endpoints unmocked (per ADR-0004).

## Playwright E2E & Neon Branching (`tests/e2e`)

- Place full-stack E2E specs in `tests/e2e/*.spec.ts` (`@baretext/e2e`).
- Run with `bun run test:e2e -- --reporter=line` (`line` keeps output compact; add `--last-failed` when iterating on failures).
- Local runs via `tests/scripts/e2e.ts` automatically:
  1. Create an isolated ephemeral Neon branch (`neon branches create` with a 1-hour `--expires-at` TTL).
  2. Enable Neon Realtime on that branch and pull its postgres + realtime env vars.
  3. Push the Drizzle schema using direct `DATABASE_URL_UNPOOLED` (keep pooled `DATABASE_URL` for app runtime traffic).
  4. Boot fresh `@baretext/api` and `@baretext/web` servers against that branch and run Playwright.
  5. Delete the branch on completion or signal exit.
- Local branching requires an authenticated `neon` CLI (`neon auth` + `neon link`) or `NEON_API_KEY` + `NEON_PROJECT_ID`. Set `NEON_E2E_EXISTING_DB=true` only when pointing at an externally managed branch (such as CI's `neondatabase/create-branch-action`).

## Coverage Tech Debt Gate

- Run `bun run test:coverage -- --reporter=agent` to evaluate V8 coverage across `src/**/*.{ts,tsx}` against the 80% global thresholds (lines, statements, functions, branches).
- Expect this gate to fail until existing modules reach 80% coverage; check it after adding unit tests to verify coverage trends upward without regressing.
