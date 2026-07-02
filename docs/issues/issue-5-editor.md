---
title: "Issue 5: Lexical Yjs Editor"
labels: ["ready-for-agent"]
---

# Issue 5: Lexical Yjs Editor

## Goal
Integrate the Lexical rich text editor with Yjs for CRDT-based offline conflict resolution.

## Acceptance Criteria
- [ ] Lexical editor component implemented using the new Lexical Extensions API (strictly avoid legacy plugins).
- [ ] Ensure all Lexical, Yjs, and related dependencies are installed at their absolute latest versions.
- [ ] Yjs bindings wired to Lexical.
- [ ] Editor state synchronized via `ElectricProvider` targeting the `ydoc_update` and `ydoc_awareness` Postgres tables.
- [ ] `parseToDecoder` configured as the shape parser since Yjs state vectors are stored as `BYTEA`.
- [ ] Configured `debounceMs` (e.g., 100ms) for batching writes and `LocalStorageResumeStateProvider` for efficient diff-based reconnection.
- [ ] Vitest tests (using the "Yjs Document Seam") concurrently mutating two headless Yjs `Doc` instances and applying their state vectors to validate the CRDT merge logic without mounting the UI.