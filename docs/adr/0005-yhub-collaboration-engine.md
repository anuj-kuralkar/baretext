# 0005. yhub Collaboration Engine

We replace `@electric-sql/y-electric` and Yjs 13 with `yhub` and Yjs 14 (`@y/y`), migrating client editor collaboration to `@lexical/y`.

While ElectricSQL and TanStack DB continue to manage relational `Note` metadata, rich text collaboration requires horizontal scalability and real-time streaming independent of database replication lags. We adopt `yhub` deployed as a standalone collaboration service (`@baretext/collab`) backed by Redis Streams for low-latency update distribution and PostgreSQL for periodic document compaction following `yhub`'s official storage architecture (`yhub_ydoc_v1`). Client-side Lexical editing transitions from `@lexical/yjs` to `@lexical/y` (`YCollabExtension`) over `@y/websocket`, removing client-side IndexedDB caching and delegating undo/redo entirely to the Yjs 14 CRDT runtime. Authentication is verified in-process using Better Auth session cookies on the initial WebSocket upgrade.
