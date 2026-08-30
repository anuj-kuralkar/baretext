# Glossary

- Note: The core entity in TanStack DB, carrying metadata (id, title reference, preview, tags) for listing. The `preview` field holds extracted text for list display; full rich text lives in the Document (ydoc).
- **Document (or ydoc)**: The CRDT representation of the rich text body managed by Yjs. Bound strictly to a Note but separate from it; the Note's `preview` is a derived snapshot, not the body.
- **Tag**: A label applied to a Note for organization. Tags can contain slashes (e.g., `personal/travel`) to represent hierarchical organization in the UI (a tree view), entirely replacing the concept of folders.
- **Profile**: The user's personal identity and presentation within the app (e.g., Name, Avatar). Distinct from their security credentials.
- **Account**: The security and authentication entity. Handles active sessions, linked identity providers (Google, GitHub), and account termination.
- **Preview**: The derived text snapshot (first lines of Document content) stored on `Note.preview` for fast list rendering without loading the full ydoc.
