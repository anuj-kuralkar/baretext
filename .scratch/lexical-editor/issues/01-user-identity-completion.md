# 01 — User Identity Completion

**What to build:** Finish the existing authentication flow by wiring the actual user data into the UI (specifically replacing the placeholder in the `usercard` component) and ensuring the tenant ID is globally available to authorize subsequent database sync operations.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `usercard` component displays the authenticated user's actual name/avatar instead of placeholders.
- [ ] Application state securely holds the tenant ID required for ElectricSQL sync.
