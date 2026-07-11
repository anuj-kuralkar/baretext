# 03 — ElectricSQL CRDT Sync Engine

**What to build:** The synchronization layer that guarantees a user never loses offline work. Edits made in the Lexical editor are streamed to the cloud, and offline edits merge mathematically with remote changes upon reconnection.

**Blocked by:** 01 — User Identity Completion, 02 — Offline-First Lexical CRDT Editor.

**Status:** ready-for-agent

- [ ] `ElectricProvider` connects the local `Y.Doc` to the remote Neon Postgres `ydoc_update` table (using the tenant ID from Ticket 01).
- [ ] User edits are compressed into binary diffs and queued for upload.
- [ ] Upon network restoration, queued binary updates are synced to the cloud without manual conflict resolution dialogs.
