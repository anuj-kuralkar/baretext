# 0003. Text Extraction and Previews

We extract the complete plain text of a CRDT document into a relational `text_content` column to power UI previews.

Extracting plain text from a binary Yjs vector or a deeply nested Lexical JSON tree is highly inefficient to do on-the-fly for every item in a list view. Doing this at render-time would cause severe UI blocking and lag.

To solve this, we run a Lexical mutation listener that actively extracts the entire plain text of the document during the edit phase and writes it to a `text_content` column on the `note` table. The UI then safely and cheaply slices this exact field to generate dynamic list previews on the fly. This guarantees zero-latency rendering of the Note sidebar without parsing complex data structures, and prepares the data model for future local search capabilities.
