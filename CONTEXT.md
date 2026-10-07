# Glossary

- **Note**: The core entity, carrying metadata (`id`, `text_content`, `created_at`, `updated_at`) for list rendering. Saved to Postgres on Neon and queried locally via TanStack DB for live updates.
- **Document (ydoc)**: The CRDT representation of the rich text body managed by Yjs. Bound strictly to a Note but separate from it. Ultimately saved to Postgres on Neon, while stored persistently offline via `y-indexeddb` and deleted when the user logs out.
- **Preview**: A dynamic snippet of text generated on-the-fly by the UI from `Note.text_content` for fast list rendering. It is not stored as a discrete database field.
- **Account**: The security and authentication entity managed strictly via Better Auth. Handles active sessions, linked identity providers (Google, GitHub), and account termination.
- **Profile**: The user's personal identity and presentation within the app (e.g., Name, Avatar). Distinct from their security credentials.