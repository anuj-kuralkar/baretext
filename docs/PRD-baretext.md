## Problem Statement

Note-taking applications often force users to choose between local performance (instant load times, offline capability) and cloud synchronization (multi-device access). Traditional cloud-first architectures fail when the connection drops, resulting in lost data, spinner fatigue, or read-only modes. Users need a reliable place to write that is always instantly available and never loses their train of thought, regardless of their internet connection.

## Solution

The Baretext MVP is a lightning-fast, offline-first web application designed for mobile and desktop browsers. It feels like a fluid native app because users read and write to a local database on their device, enhanced by smooth page and element animations. When the user goes offline, they can continue to create and edit notes without interruption. When the connection is restored, the application seamlessly and automatically syncs changes to the cloud, merging any conflicts intelligently without user intervention.

## User Stories

1. As a user, I want to sign up or log in using a third-party provider (Google or GitHub), so that I don't have to manage a new password.
2. As a user, I want to view a list of all my existing notes on the main dashboard, so that I can quickly find what I was working on.
3. As a user, I want to create a new text note instantly, so that I can capture my thoughts before I forget them.
4. As a user, I want to format my notes using basic rich text (bold, italic, bulleted lists), so that my writing is structured and readable.
5. As a user, I want the application to load instantly even when my device is in airplane mode, so that I am never blocked from accessing my data.
6. As a user, I want to edit an existing note while completely offline, so that I can keep working on subways or flights.
7. As a user, I want my offline edits to automatically sync to the cloud the moment my device reconnects, so that my data is safely backed up without me clicking a "sync" button.
8. As a user, I want the system to handle concurrent edits safely (e.g., if I edit offline on my phone and offline on my laptop), so that I never lose a paragraph due to a sync conflict.
9. As a user, I want a dedicated Settings section divided into distinct sub-pages, so that I can easily navigate my account preferences.
10. As a user, I want to edit my display name and email address in Settings, so that my profile is accurate.
11. As a user, I want to view my connected authentication methods in Settings, so that I know how I log in.
12. As a user, I want to securely log out from the Settings page, so that my notes are protected on shared devices.

## Implementation Decisions

- **Platform Focus:** The application is exclusively a responsive web app optimized for desktop and mobile browsers. There will be no native iOS or Android binaries.
- **Fluid UI & Animations:** The application will leverage the View Transitions API for seamless page navigations (e.g., moving from the Note List to Settings). Entry and exit CSS animations will be used for DOM mutations (e.g., adding or deleting a note in the list).
- **Local-First Architecture:** Prioritize reading and writing to an embedded local database in the browser to guarantee zero-latency interactions. The cloud database serves only as a synchronization and backup layer.
- **Conflict Resolution Strategy:** The editor will use Collaborative/CRDT technology to automatically merge text at the character level without manual "conflict resolution" dialogs.
- **Data Privacy:** User data is strictly isolated. A user can only ever sync and decrypt notes belonging to their unique tenant ID.

## Testing Decisions

A good test in this project verifies observable user behavior rather than internal implementation details. Tests should assert that a note is visible or saved, not that a specific database function was called.

- **Offline Behavior Seam (E2E):** The highest fidelity testing seam will simulate actual network disconnects. We will use browser automation tools to load the app, sever the network connection, write a note, restore the network, and assert that the note appears on a secondary authenticated client.
- **Sync Logic Seam (Integration):** The module responsible for syncing data between the local and cloud databases will be tested in isolation to ensure data is not dropped during edge cases.

## Good to Have / Phase 2 (Out of Scope for MVP)

To ensure a rapid MVP delivery, the following features are defined as "Good to Have" and will be tackled in Phase 2:

- **Profile Picture Uploads:** Allowing users to upload custom avatars requires cloud blob storage infrastructure (e.g., Vercel Blob), which is deferred past the MVP.
- **Image/File Attachments:** Inline media inside notes is deferred to keep the initial sync engine strictly focused on text CRDTs.
- **Additional Auth Methods:** Passkeys (WebAuthn) and Magic Link emails are fast-follows after the core OAuth providers are proven.
- **Organization:** Folders, tagging systems, and trash/archive bins.

## Further Notes

This PRD covers the Baretext MVP. Once the core offline-sync engine and editor are proven stable, subsequent PRDs will introduce the "Good to Have" media support and complex organizational features.