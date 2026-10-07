# 0001. Offline-First Sync Architecture

We use ElectricSQL, TanStack DB, Yjs, and `y-indexeddb` to manage note state, entirely discarding Lexical JSON persistence.

For an offline-first rich text editor, simple REST calls and standard Postgres fail when the network drops. Resolving offline edits requires a Conflict-free Replicated Data Type (CRDT) to guarantee mathematical convergence when two devices edit the same text while disconnected.

We selected Yjs as our CRDT engine. Because Lexical JSON state cannot merge deterministically offline, we discard the JSON output completely and use the binary Yjs state vector (`BYTEA`) as the absolute source of truth. ElectricSQL syncs this binary data alongside the Note metadata to our Neon cloud Postgres database, which acts as the ultimate durable backend for both entities. Locally, we use TanStack DB on the client to power live queries and execute optimistic updates with automatic rollback, ensuring a zero-latency feel. Meanwhile, `y-indexeddb` persists the active document in the browser so that users do not lose data if they close their tab before their internet connection returns.
