import { McpServer, ResourceTemplate } from "@modelcontextprotocol/server";
import { z } from "zod";
import { NoteDb } from "./db";

export function createBaretextMcpServer(userId: string) {
  const server = new McpServer({
    name: "baretext",
    version: "0.0.1",
  });

  server.registerTool(
    "list_notes",
    {
      description:
        "List the authenticated user's notes with preview snippets, IDs, and timestamps",
      inputSchema: z.object({
        limit: z.number().int().min(1).max(100).optional().default(50),
        offset: z.number().int().min(0).optional().default(0),
      }),
    },
    async ({ limit, offset }) => {
      const notes = await NoteDb.listNotes(userId, limit, offset);
      return {
        content: [{ type: "text", text: JSON.stringify(notes, null, 2) }],
      };
    },
  );

  server.registerTool(
    "get_note",
    {
      description:
        "Retrieve a note by its UUID, returning its full body as Markdown and metadata",
      inputSchema: z.object({
        id: z.string().uuid().describe("UUID of the note"),
      }),
    },
    async ({ id }) => {
      const note = await NoteDb.getNote(id, userId);
      if (!note) {
        return {
          isError: true,
          content: [{ type: "text", text: `Note with ID ${id} not found.` }],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `# Note: ${note.id}\nUpdated: ${note.updatedAt.toISOString()}\n\n${note.markdown}`,
          },
        ],
      };
    },
  );

  server.registerTool(
    "search_notes",
    {
      description: "Search notes by keyword across text content",
      inputSchema: z.object({
        query: z.string().min(1).describe("Search query keyword"),
        limit: z.number().int().min(1).max(50).optional().default(20),
      }),
    },
    async ({ query, limit }) => {
      const results = await NoteDb.searchNotes(query, userId, limit);
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    },
  );

  server.registerTool(
    "write_note",
    {
      description:
        "Create a new note or update an existing one using Markdown content. Automatically synchronizes Yjs CRDT state and plain text preview.",
      inputSchema: z.object({
        id: z
          .string()
          .uuid()
          .optional()
          .describe(
            "UUID of existing note to update. Omit to create a new note.",
          ),
        markdown: z.string().describe("Markdown content of the note"),
      }),
    },
    async ({ id, markdown }) => {
      try {
        const saved = await NoteDb.saveNote({ id, markdown, userId });
        return {
          content: [
            {
              type: "text",
              text: `Successfully ${id ? "updated" : "created"} note ${saved.id}.`,
            },
          ],
        };
      } catch (err) {
        return {
          isError: true,
          content: [{ type: "text", text: (err as Error).message }],
        };
      }
    },
  );

  server.registerTool(
    "delete_note",
    {
      description: "Delete a note by its UUID",
      inputSchema: z.object({
        id: z.string().uuid().describe("UUID of the note to delete"),
      }),
    },
    async ({ id }) => {
      const deleted = await NoteDb.deleteNote(id, userId);
      return {
        content: [
          {
            type: "text",
            text: deleted
              ? `Note ${id} deleted successfully.`
              : `Note ${id} not found or already deleted.`,
          },
        ],
      };
    },
  );

  server.registerTool(
    "get_user_info",
    {
      description:
        "Get profile information and note count for the authenticated user",
      inputSchema: z.object({}),
    },
    async () => {
      const profile = await NoteDb.getUserProfile(userId);
      return {
        content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
      };
    },
  );

  server.registerResource(
    "note",
    new ResourceTemplate("note://{noteId}", { list: undefined }),
    {
      mimeType: "text/markdown",
      description: "Read note content as Markdown",
    },
    async (uri, { noteId }) => {
      const note = await NoteDb.getNote(noteId as string, userId);
      if (!note) {
        throw new Error(`Note ${noteId} not found`);
      }
      return {
        contents: [
          {
            uri: uri.href,
            text: note.markdown,
            mimeType: "text/markdown",
          },
        ],
      };
    },
  );

  return server;
}
