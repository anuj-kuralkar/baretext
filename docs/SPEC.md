
## Problem Statement

Note-taking applications force users to choose between local performance (instant load times, offline capability) and cloud synchronization (multi-device access). Traditional cloud-first architectures fail when the connection drops, resulting in lost data, spinner fatigue, or read-only modes. Users need a reliable place to write that is always instantly available and seamlessly merges changes made across different offline devices without manual conflict resolution.

## Solution

The Baretext Editor MVP is an offline-first rich text editor that uses a Conflict-free Replicated Data Type (CRDT) engine. Users can read, write, and format notes to a local database with zero latency. When a user writes while completely disconnected, their work is saved locally. Upon reconnection, the system mathematically merges their offline edits with any changes made on other devices, guaranteeing that no text is ever lost to an overwrite conflict. 

## User Stories

1. As a note-taking user, I want to type plain text into a fluid editor, so that I can capture my thoughts quickly.
2. As a note-taking user, I want to format text as bold, so that I can emphasize important words.
3. As a note-taking user, I want to format text as italic, so that I can indicate titles or subtle emphasis.
4. As a note-taking user, I want to structure my notes using headings (H1, H2, H3), so that long notes are easy to scan.
5. As a note-taking user, I want to create bulleted lists, so that I can track items without numbering.
6. As a note-taking user, I want to create numbered lists, so that I can write step-by-step instructions.
7. As a note-taking user, I want to format text as blockquotes, so that I can visually separate quotes from my own text.
8. As a note-taking user, I want to type `#tagname` and have it recognized as a tag, so that I can organize my notes.
9. As a note-taking user, I want tags to support slashes (e.g., `#work/projects`), so that I can create folder-like hierarchies.
10. As an offline user, I want the editor to load instantly without internet, so that I am never blocked from writing.
11. As an offline user, I want to edit an existing note while disconnected, so that I can work on the subway or flights.
12. As a reconnecting user, I want my offline edits to automatically sync when my internet returns, so that I don't lose data.
13. As a multi-device user, I want edits made offline on my phone and laptop to merge seamlessly, so that I never lose text to a manual conflict resolution screen.
14. As a browsing user, I want the sidebar to show a short plain-text snippet of my notes, so that I know what's inside before clicking.
15. As a browsing user, I want the sidebar previews to ignore images and complex formatting, so that the UI stays clean and readable.
16. As an organizing user, I want my notes filtered instantly when I click a tag, so that I can find related content without delay.
17. As a user, I want to sign up or log in using a third-party provider (Google or GitHub), so that I don't have to manage a new password.
18. As a user, I want a dedicated Settings section divided into distinct sub-pages, so that I can easily navigate my account preferences.
19. As a user, I want to edit my display name and email address in Settings, so that my profile is accurate.
20. As a user, I want to view my connected authentication methods in Settings, so that I know how I log in.
21. As a user, I want to securely log out from the Settings page, so that my notes are protected on shared devices.

## Implementation Decisions

- **Ecosystem:** We will use Lexical as the editor framework, bound to Yjs as the CRDT engine via the official `@lexical/yjs` package. Synchronization with Postgres is handled via `@electric-sql/y-electric`.
- **Source of Truth:** The binary Yjs state vector (`BYTEA`) is the absolute, lossless source of truth for the document body. Lexical JSON state is discarded entirely to prevent corruption and state mismatches.
- **Persistence:** Local persistence of the Yjs document will be memory-only for the MVP (as documented in ADR 0001). True offline durable storage (surviving tab closures without internet) is deferred until TanStack Browser SQLite persistence is mature.
- **History Management:** Lexical's native `HistoryExtension` will be removed. Undo/redo will be delegated strictly to Yjs's CRDT-aware `UndoManager` to prevent local history actions from corrupting remotely merged text.
- **Data Denormalization (Tags):** A Lexical mutation listener will monitor `HashtagNode` creation and destruction. When changed, the extracted tags will be synced to a relational JSON array column on the local TanStack `note` table. This allows instant UI filtering without loading or parsing heavy CRDT blobs.
- **Data Denormalization (Previews):** An update listener will extract the first ~150 characters of plain text using Lexical's text extraction methods, actively skipping non-text nodes. This snippet will be written to a relational `preview` column for fast NoteList rendering.
- **Ephemerality:** Yjs Awareness (live cursors, presence) is completely omitted. The architecture focuses strictly on durable offline state rather than multiplayer collaboration.
- **Save Paradigm:** Manual "AutoSave" timers serializing JSON to Server Actions are removed. Saving is handled entirely by ElectricProvider syncing binary diffs.
- **Node Registration:** The editor configuration will explicitly register the required nodes for the MVP's formatting scope. Crucially, this must include `HashtagNode` (from `@lexical/hashtag`) to power the inline tag feature and the extraction pipeline, alongside standard rich text nodes (e.g., `HeadingNode`, `ListNode`, `QuoteNode`).
- **Platform Focus:** The application is exclusively a responsive web app optimized for desktop and mobile browsers. There will be no native iOS or Android binaries.
- **Fluid UI & Animations:** The application will leverage the View Transitions API for seamless page navigations (e.g., moving from the Note List to Settings). Entry and exit CSS animations will be used for DOM mutations (e.g., adding or deleting a note in the list).
- **Local-First Architecture:** Prioritize reading and writing to an embedded local database in the browser to guarantee zero-latency interactions. The cloud database serves only as a synchronization and backup layer.
- **Data Privacy:** User data is strictly isolated. A user can only ever sync and decrypt notes belonging to their unique tenant ID.

## Testing Decisions

- Test implementation is explicitly deferred for this phase. No tests will be added during the editor implementation.
- **Future Test Philosophy:** When implemented, tests will focus exclusively on observable behavior (e.g., asserting text appears after a reconnect) rather than internal implementation details (e.g., asserting a specific SQLite query fired).
- **Future Modules to be Tested:** The offline sync boundary (via E2E browser tests mimicking network disconnects) and the CRDT merge logic (via headless Node tests injecting conflicting Yjs vectors).

## Out of Scope

- **Search:** All search functionality (exact match and advanced fuzzy search) is out of scope. The search UI button will be present but disabled.
- **Media:** Images, file attachments, and embedded media inside notes.
- **Avatars:** Profile picture uploads.
- **Traditional Folders:** Organization relies entirely on the hierarchical Tag system.
- **Multiplayer:** Live cursors and presence (Yjs Awareness).

## Further Notes

This spec covers the core offline-capable editor MVP. Once stable, future specs will address search functionality and media attachments.
