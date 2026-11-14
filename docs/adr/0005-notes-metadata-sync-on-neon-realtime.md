# 0005. Notes Metadata Sync on Neon Realtime

We migrated the Note metadata sync from ElectricSQL shapes to Neon Realtime sealed queries, because Electric Cloud — the hosted sync service baretext depended on — is winding down following Electric's acquisition by Databricks (August 2026). Electric's open-source Postgres Sync remains self-hostable, but running our own sync infrastructure is ops burden for a product whose hosted offering is disappearing; Neon Realtime is the successor sync primitive built by the same team, and baretext already runs on Neon Postgres.

The migration covers only the Note metadata collection (`apps/web/src/collections/note.ts`): the API seals a per-user live query via `/notes/live` and the client hydrates it over TanStack DB SSR. Yjs document sync stays on Electric's open-source shape protocol (`apps/api/src/routes/shape/*`, `@electric-sql/y-electric`), because Neon Realtime does not yet cover Yjs binary update transport. The result is a deliberate hybrid: two sync mechanisms coexist until Neon Realtime grows a Yjs path, at which point the Electric shape proxy can be retired.

### Considered Options

- **Self-host open-source Electric**: keeps the stack uniform but adds a long-running sync service to operate right as its commercial support wound down.
- **Move everything to Neon Realtime**: not yet possible — collaborative editing depends on Electric's Yjs integration.
- **Hybrid (chosen)**: migrate the metadata path now, retire the Electric proxy when a Yjs equivalent lands.

### Consequences

- Sealed queries are short-lived bearer capabilities: they must never be cached and flow only through authenticated, cookie-scoped routes.
- Sync behavior now differs per entity: Notes update via Neon Realtime, Documents via Electric. Any new synced entity must choose a side.
- Env validation and deployment gained the Neon Realtime URL requirement alongside the existing Electric configuration.
