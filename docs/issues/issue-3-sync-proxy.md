---
title: "Issue 3: Sync Infrastructure (Electric Proxy)"
labels: ["ready-for-agent"]
---

# Issue 3: Sync Infrastructure

## Goal
Establish the secure server-side Electric proxy for TanStack DB shape syncing.

## Acceptance Criteria
- [ ] Secure Electric Proxy Server Route created at `/api/sync`.
- [ ] Route expects `table` as a query parameter (e.g. `?table=notes`) and forwards it to Electric.
- [ ] Proxy route validates the active Better Auth session.
- [ ] Proxy route forwards `ELECTRIC_PROTOCOL_QUERY_PARAMS` while cleaning `content-encoding` and `content-length` headers.
- [ ] Proxy implements tenant filters via `WHERE` positional params (e.g. `user_id = $1`) to isolate user data.
- [ ] Vitest integration tests verifying the proxy rejects unauthenticated requests and correctly forwards protocol params.