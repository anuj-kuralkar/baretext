# Note.preview replaces Note.content

The `Note` entity previously exposed `content`, which blurred the boundary with `Document` (the CRDT body). Renamed to `preview` to make explicit that this is a derived list-display snapshot, not the authoritative rich text.

Consequences: `NotePreview` reads `note.preview`; DB column and wire schema should follow. The full ydoc remains in `Document`.
