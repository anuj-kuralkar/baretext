---
title: "Issue 4: Local-First Data Layer (TanStack DB)"
labels: ["ready-for-agent"]
---

# Issue 4: Local-First Data Layer

## Goal
Implement the TanStack DB client context and optimistic mutations for the `notes` entity.

## Acceptance Criteria
- [ ] TanStack DB client context established on the frontend.
- [ ] `electricCollectionOptions` configured for the `notes` table to point to the secure proxy.
- [ ] Ensure type parsers (like `timestamptz`) are mapped in `shapeOptions.parser`.
- [ ] Optimistic write functions created for inserting/updating notes, returning the Postgres `txid` via `pg_current_xact_id()` after server confirmation.
- [ ] `useLiveQuery` implemented to read notes seamlessly from the local collection.
- [ ] Vitest tests (using the "Local Data Store Seam") dispatching optimistic mutations and asserting the local cache state, independent of UI rendering.