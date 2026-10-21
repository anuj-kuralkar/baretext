import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { env } from "./env";
import { createBaretextMcpServer } from "./server";

const userId = env.BARETEXT_USER_ID;

if (!userId) {
  console.error(
    "Error: BARETEXT_USER_ID is required to run the stdio MCP server for a specific user.",
  );
  process.exit(1);
}

void serveStdio(() => createBaretextMcpServer(userId));
console.error(`Baretext MCP stdio server initialized for user ${userId}`);
