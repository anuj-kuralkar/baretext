# ADR 0001: Memory-Only Yjs Persistence for CRDT State

## Context
We are implementing a Lexical editor with Yjs for offline CRDT-based conflict resolution. To function fully offline across sessions (surviving tab closures without internet), Yjs typically requires a local persistence adapter like `y-indexeddb`. 

However, we are anticipating the stable release of `@tanstack/browser-db-sqlite-persistence` and want to avoid adding a temporary dependency (`y-indexeddb`) that we will later replace.

## Decision
We will use **memory-only** for the Yjs document state (`Y.Doc`) locally in the browser, deferring true offline persistence until TanStack DB's SQLite persistence is viable for storing CRDT binary updates.

## Consequences
- **Positive:** Reduces dependency bloat and keeps the current implementation minimal.
- **Negative:** If a user edits a note while offline and closes the browser tab before the connection is restored, those un-synced edits will be permanently lost because they exist only in RAM.
