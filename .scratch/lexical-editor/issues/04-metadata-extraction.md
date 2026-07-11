# 04 — Metadata Extraction (Previews & Tags)

**What to build:** The data denormalization engine. As the user types, the app extracts plain-text snippets and tags, making the existing dashboard instantly searchable without parsing heavy CRDT blobs.

**Blocked by:** 02 — Offline-First Lexical CRDT Editor.

**Status:** ready-for-agent

- [ ] When the editor content changes, extract the first ~150 characters of plain text (skipping images/complex nodes) and save to the TanStack DB `preview` column.
- [ ] A mutation listener monitors the creation/destruction of `HashtagNode`s and saves extracted tags to a JSON array column on the TanStack DB `note` table.
- [ ] The existing Note List displays the generated previews.
- [ ] Clicking a tag in the UI instantly filters the existing Note List based on the denormalized tag array.
