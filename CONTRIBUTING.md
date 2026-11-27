# Contributing to Baretext

This guide covers how to set up the Baretext monorepo for local development.

## 1. Environment Variables

Several workspaces require their own environment variables. Copy the `.env.example` file to `.env` in the following locations and populate them with your local credentials:

- `apps/web/.env.example` -> `apps/web/.env`
- `apps/api/.env.example` -> `apps/api/.env`
- `packages/db/.env.example` -> `packages/db/.env`

## 2. Install Dependencies

We use Bun for package management. From the project root, run:

```bash
bun install
```

## 3. Install Chromium for E2E Tests

Install the Playwright Chromium browser before running E2E tests locally:

```bash
bun --filter @baretext/e2e install-browser
```

Local E2E runs (`bun run test:e2e`) create an ephemeral Neon branch via the `neon` CLI (`neon auth` + `neon link`, or `NEON_API_KEY` + `NEON_PROJECT_ID`) and clean it up automatically when the suite finishes.

### Test Commands and Naming

- `bun run test` / `bun run test:unit` runs colocated Vitest unit tests (`*.test.ts(x)`), including React Testing Library component tests and Elysia `app.handle()` route tests.
- `bun run test:coverage` runs unit tests with V8 coverage checks (80% global threshold).
- `bun run test:e2e` runs Playwright E2E specs (`tests/e2e/*.spec.ts`) against an isolated Neon branch.
- `bun run test:all` runs `test:unit` followed by `test:e2e`.

## 4. Running Local Servers

To start the development servers in watch mode:

```bash
# Start the Next.js frontend
bun dev:web

# Start the ElysiaJS backend
bun dev:api
```

## 5. Code Quality (Typechecking, Formatting & Linting)

We use TypeScript (`tsc --noEmit`) for typechecking and [Biome](https://biomejs.dev/) for formatting and linting:

```bash
# Typecheck all workspace packages
bun check

# Format files with Biome
bun fmt

# Check formatting without writing
bun fmt:check

# Lint files with Biome
bun lint
```
