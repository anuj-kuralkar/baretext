# 02 — Offline-First Lexical CRDT Editor

**What to build:** Mount the core writing experience inside the existing note page shell. A user can open an existing note and write using basic formatting, with the state safely managed by an in-memory Yjs CRDT and a CRDT-aware history stack for robust offline edits.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Lexical editor interface is mounted inside the existing `[noteId]/page.tsx` shell.
- [ ] User can format text using bold, italic, headings, lists, and blockquotes, hashtag.
- [ ] Editor state is bound to a memory-only Yjs Document (`Y.Doc`).
- [ ] Standard Lexical history is disabled; Yjs `UndoManager` safely handles local undo/redo operations.
