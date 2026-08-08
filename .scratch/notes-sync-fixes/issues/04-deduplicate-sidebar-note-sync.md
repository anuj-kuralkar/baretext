# 04 — Deduplicate Sidebar Note Sync

**What to build:** Fix the duplicate `table=note` shape streams originating from the sidebar/global state, recovering 1-2 concurrent connections for the app to use elsewhere.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Locate the `useLiveQuery` (or equivalent TanStack DB hook) responsible for the global/sidebar notes list.
- [ ] Ensure the component tree is not unnecessarily mounting the provider twice, or configure the collection to properly deduplicate its `ShapeStream` subscriptions.
- [ ] Verify in the Network tab that only one `GET /shape?...&table=note` stream is `[pending]` (active) at any given time while viewing the application.
