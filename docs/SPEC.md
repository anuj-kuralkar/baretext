## Problem Statement

Note-taking applications force users to choose between local performance (instant load times, offline capability) and cloud synchronization (multi-device access). Traditional cloud-first architectures fail when the connection drops, resulting in lost data, spinner fatigue, or read-only modes. Users need a reliable place to write that is always instantly available and seamlessly merges changes made across different offline devices without manual conflict resolution.

## Solution

The Baretext Editor is an offline-first rich text editor that uses a Conflict-free Replicated Data Type (CRDT) engine. Users can read, write, and format notes with zero latency. When a user writes while completely disconnected, their work is saved locally. Upon reconnection, the system mathematically merges their offline edits with any changes made on other devices, guaranteeing that no text is ever lost to an overwrite conflict.

## User Stories

1. As a note-taking user, I want to type plain text into a fluid editor, so that I can capture my thoughts quickly.
2. As a note-taking user, I want to format text as bold, italic, headings, lists, and blockquotes, so that I can organize and emphasize my content.
3. As an offline user, I want the editor to load instantly without internet, so that I am never blocked from writing.
4. As an offline user, I want my active edits to save locally to IndexedDB, so that I don't lose data if I close the tab before reconnecting.
5. As a reconnecting user, I want my offline edits to automatically sync to the cloud database when my internet returns.
6. As a browsing user, I want the sidebar to show a short plain-text snippet of my notes (preview), so that I know what's inside before clicking.
7. As a user, I want to sign up or log in securely using Better Auth (via OAuth providers like Google/GitHub).
8. As a user, I want a dedicated Settings section to manage my display name, email, authentication methods, and securely log out (which wipes local offline data).

## Implementation Decisions

- **Ecosystem:** Next.js for the frontend, ElysiaJS for the API Backend. Lexical is the editor framework, bound to Yjs as the CRDT engine via `@lexical/yjs`. Syncing with Postgres (on Neon) is handled via `@electric-sql/y-electric`. TanStack DB is used on the client to power live queries and optimistic updates with automatic rollback.
- **Authentication:** Better Auth acts as the absolute boundary for identities, sessions, and security constraints.
- **Source of Truth:** The binary Yjs state vector (`BYTEA`) is the absolute, lossless source of truth for the document body. Lexical JSON state is discarded entirely to prevent corruption.
- **Persistence:** Both Notes and Documents are ultimately saved to a cloud Postgres database on Neon. Locally, TanStack DB drives optimistic updates so the UI feels instant, while the active Yjs document relies on `y-indexeddb` to survive tab closures offline. Local data is destroyed when a user securely logs out.
- **Data Denormalization (Text Content):** Lexical mutation listeners actively extract the *entire plain text* of the document into a `text_content` column on the `note` table.
- **Dynamic Previews:** The UI dynamically slices the `text_content` string on the client to generate list previews. There is no discrete `preview` column.
- **Ephemerality:** Yjs Awareness (live cursors, presence) is completely omitted. Focus is strictly on durable offline state, not multiplayer collaboration.
- **Save Paradigm:** Manual "AutoSave" timers serializing JSON are removed. Saving is handled by ElectricProvider syncing binary diffs to Neon, and `y-indexeddb` capturing local offline state.

- Test implementation is explicitly deferred for this phase.
- **Future Test Philosophy:** Tests will focus exclusively on observable behavior rather than internal implementation details.

## Out of Scope / Deferred

- **Tags & Hierarchies:** Labeling and folder-like structures via tags are deferred.
- **Search:** Local database search functionalities are deferred.
- **Media & Attachments:** Images and file attachments inside notes are deferred. They will eventually utilize Neon storage, but the offline strategy is undecided.
- **Avatars:** Profile picture uploads.
- **Multiplayer:** Live cursors and presence.