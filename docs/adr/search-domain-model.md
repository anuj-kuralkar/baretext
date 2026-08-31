# Search Domain Model

## Entities
- `Note`: Tiptap document (pure text + image URLs/alt); synced via ElectricSQL / TanStack DB.
- `Tag`: filter dimension on `Note`.
- `SearchResult`: matched `Note` IDs + snippet text (`snippet` prop); highlight = non-destructive overlay spans in `NotePreview`.
- `NoteSearch`: custom component (`NoteSearch`); inline input in sidebar (desktop, expands on click) / drawer bottom (mobile).
- `NotePreview`: renders `snippet` prop (from Orama) when `NoteSearch` active; else renders `note.preview`. Non-destructive.

## Modes
- `CROSS_NOTE` (`NoteSearch`): Orama (`orama-js`) fuzzy index over note text; single text input; highlights results in `NoteList`; filters list to matches.
- `IN_EDITOR` (Tiptap search-and-replace): out of scope.

## UI Layout Dependency
- NoteSearch works with current layout; sidebar/drawer redesign is independent.
