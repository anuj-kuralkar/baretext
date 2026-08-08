# 02 — Fix Connection Pool Leak (Electric Provider Teardown)

**What to build:** Ensure that when a note is unmounted (e.g., when the user switches notes), the underlying `ShapeStream` is fully destroyed. This will stop ghost polling that currently exhausts the browser's 6-connection limit per origin and causes the "never loads until refreshed" lockup.

**Blocked by:** 01 — Stabilize Editor Rendering

**Status:** ready-for-agent

- [ ] Modify `apps/web/src/components/notes/editor/electric-provider.ts` or the Lexical collaboration teardown to ensure `provider.destroy()` is called.
- [ ] Verify that rapidly clicking through 10+ different notes in the sidebar does not leave dangling `[pending]` requests for `ydoc_update` shapes in the Network tab.
- [ ] Verify that the Next.js app remains responsive to new data fetches after rapid navigation.
