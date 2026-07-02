---
title: "Issue 6: Settings Dashboard"
labels: ["ready-for-agent"]
---

# Issue 6: Settings Dashboard

## Goal
Build a dedicated, multi-page settings section for users to manage their account preferences and authentication state.

## Acceptance Criteria
- [ ] A main Settings layout created, divided into distinct sub-pages or tabs.
- [ ] Profile Sub-page: Form implemented to edit Display Name and Email (enable `user.changeEmail.enabled` in Better Auth config).
- [ ] Auth Sub-page: View implemented displaying connected authentication methods (Google/GitHub).
- [ ] Logout capability implemented securely using `revokeSession()`.
- [ ] (Phase 2 Note: Profile picture upload UI can be mocked, but actual upload logic is deferred).