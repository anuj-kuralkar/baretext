# 03 — Guarantee Save-on-Unmount (Note Content Data Loss)

**What to build:** Ensure that any pending text edits in the editor's 500ms debounce queue are flushed and saved successfully when the user navigates away, instead of the API request silently aborting with `net::ERR_FAILED`.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Identify why the `PATCH` request to save note content is being aborted on component unmount (e.g., missing cleanup flush, or `fetch` signal abortion).
- [ ] Implement a flush mechanism on unmount, or decouple the save mutation from the unmounting component's `AbortController` so it completes in the background.
- [ ] Verify that typing text and immediately clicking another note in the sidebar successfully saves the typed text to the database/API without a network failure.
