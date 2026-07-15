# Glossary

- **Note**: The core entity in TanStack DB, representing the metadata (like title, ID, creation date). Used for listing and organizing without loading the full CRDT structure.
- **Document (or ydoc)**: The CRDT representation of the rich text body managed by Yjs. It is bound strictly to the contents of a Note.
- **Tag**: A label applied to a Note for organization. Tags can contain slashes (e.g., `personal/travel`) to represent hierarchical organization in the UI (a tree view), entirely replacing the concept of folders.
- **Profile**: The user's personal identity and presentation within the app (e.g., Name, Avatar). Distinct from their security credentials.
- **Account**: The security and authentication entity. Handles active sessions, linked identity providers (Google, GitHub), and account termination.
