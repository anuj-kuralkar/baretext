# 0006. Yjs Document Sync on Neon Realtime

Following the initial metadata sync migration in ADR 0005, we completed the migration of all Yjs document and awareness sync from ElectricSQL to Neon Realtime. All ElectricSQL dependencies, shape proxies, and configurations have been retired.

### Context & Motivation

ElectricSQL shape proxy and `@electric-sql/y-electric` were deprecated and tied to the discontinued Electric Cloud service. Furthermore, Lexical has evolved with its nightly releases providing the `@lexical/y` package and Yjs 14 compatibility, while `y-indexeddb` is incompatible with Yjs 14.

### Decisions

- **Custom Neon Realtime Yjs Provider (`NeonRealtimeProvider`):** Implemented a dedicated provider in `apps/web/src/lib/neon-realtime-provider.ts` integrating with Yjs 14 (`@y/y`) and Yjs Awareness (`@y/protocols/awareness`). It subscribes to sealed queries for document updates and awareness states via `@neon/realtime/client`, handles local mutations via PUT endpoints (`/yjs/update`, `/yjs/awareness`), and auto-refreshes sealed queries every 30 seconds.
- **Lexical Nightly & `@lexical/y`:** Upgraded Lexical packages to nightly releases (`0.53.1-nightly.20261118.0`) and integrated `@lexical/y`'s `yCollab` extension.
- **Offline Persistence via `@lexical/y/offline`:** Replaced `y-indexeddb` with `@lexical/y/offline` (`openYOfflineStore`, `attachYOfflineSession`, `loadYOffline`), providing robust IndexedDB offline storage for Yjs 14.
- **Collaborative Cursors:** Implemented real-time collaborative cursor tracking and rendering via `binding.getCursor()` and `binding.$resolveCursor()`.
- **Database Indexes & API Consistency:** Standardized all API routes, models, services, and headers to use `noteId` instead of `room`, and added performance indexes on `ydoc_update.note_id` and `ydoc_awareness.note_id`.
- **Removal of ElectricSQL:** Removed `@electric-sql/client`, Electric shape route endpoints, `ELECTRIC_URL` environment variables, and proxy headers.

### Consequences

- Zero ElectricSQL dependencies or runtime proxies remain in the repository.
- Full offline-first editing and real-time multiplayer collaboration operate natively on Neon Postgres via Neon Realtime.
