# 01 — Stabilize Editor Rendering (Yjs & Provider Lifecycle)

**What to build:** Prevent the Lexical editor from tearing down and recreating the Yjs document and Electric provider on every React render. The `<Editor>` component must maintain a stable `Y.Doc` and `providerFactory` identity throughout its lifecycle for a given note. 

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Move `new Y.Doc()` instantiation inside a `useState` or `useMemo` so it survives re-renders of the `<Editor>`.
- [ ] Stabilize the `providerFactory` function in `CollaborationExtensionComponent` using `useCallback` or similar, so it doesn't trigger a tear-down in the Lexical `CollaborationPlugin`.
- [ ] Verify that typing and minor state changes in the parent no longer cause the editor to lose focus or dump its state.
