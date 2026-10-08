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

## 3. Running Local Servers

To start the development servers in watch mode:

```bash
# Start the Next.js frontend
bun dev:web

# Start the ElysiaJS backend
bun dev:api
```

## 4. Code Quality (Linting & Formatting)

We use [Biome](https://biomejs.dev/) as our formatter and linter. To check your code before committing:

```bash
# Report issues
bun check

# Automatically fix safe issues
bun check:write
```