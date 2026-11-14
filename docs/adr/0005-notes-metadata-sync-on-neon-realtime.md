# 0005. Notes Metadata Sync on Neon Realtime

We migrated the Note metadata sync from ElectricSQL shapes to Neon Realtime sealed queries, because Electric Cloud — the hosted sync service baretext depended on — is winding down following Electric's acquisition by Databricks (August 2026). When the wind-down hit, we briefly self-hosted open-source Electric and it ran fine, but with the hosted product gone, a self-hosted fork would receive no further updates: a frozen dependency in the most critical data path of the app. Neon Realtime, built by the same team on the Neon Postgres baretext already runs, is the supported successor.

The migration covers only the Note metadata collection (`apps/web/src/collections/note.ts`): the API seals a per-user live query via `/notes/live` and the client hydrates it over TanStack DB SSR. Yjs document sync stays on Electric's open-source shape protocol (`apps/api/src/routes/shape/*`, `@electric-sql/y-electric`) for now — Neon Realtime has published Yjs examples, and migrating it is the planned next step, after which the Electric shape proxy can be retired entirely.

### Considered Options

- **Self-host open-source Electric**: attempted during the Cloud wind-down and worked, but a self-hosted fork receives no further updates — dead end in the critical data path.
- **Move everything to Neon Realtime**: not yet done for Yjs, though examples exist; planned as the immediate follow-up.
- **Hybrid (chosen)**: migrate the metadata path now, retire the Electric shape proxy once Yjs moves to Neon Realtime.

### Consequences

- Sealed queries are short-lived bearer capabilities: they must never be cached and flow only through authenticated, cookie-scoped routes.
- Sync behavior temporarily differs per entity: Notes update via Neon Realtime, Documents via Electric. The Yjs/Electric path is slated for migration, retiring the shape proxy; until then, any new synced entity must choose a side.
- Env validation and deployment gained the Neon Realtime URL requirement alongside the existing Electric configuration.
