---
title: "Issue 2: Authentication (Better Auth)"
labels: ["ready-for-agent"]
---

# Issue 2: Authentication

## Goal
Implement secure authentication flows using Better Auth.

## Acceptance Criteria
- [ ] Better Auth integrated into the Next.js App Router using the Drizzle Postgres adapter.
- [ ] Ensure environment variables `BETTER_AUTH_SECRET` (min 32 chars) and `BETTER_AUTH_URL` are configured.
- [ ] Generate the auth database schema using `npx @better-auth/cli@latest generate`.
- [ ] Route handler created at `app/api/auth/[...all]/route.ts`.
- [ ] Google OAuth and GitHub OAuth plugins configured in `auth.ts`.
- [ ] Login/Register UI components built and matched to the design system.
- [ ] Authentication flows tested efficiently using the Better Auth `test-utils` plugin.