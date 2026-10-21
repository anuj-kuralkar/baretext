import { createMcpProtectedRequestHandler } from "@better-auth/mcp";
import {
  createMcpHandler,
  hostHeaderValidationResponse,
} from "@modelcontextprotocol/server";
import { NoteDb } from "./db";
import { env } from "./env";
import { createBaretextMcpServer } from "./server";

const mcpHandler = createMcpHandler(({ authInfo }) => {
  const userId = (authInfo?.clientId as string) || env.BARETEXT_USER_ID;
  if (!userId) {
    throw new Error("Unauthenticated: no user ID resolved");
  }
  return createBaretextMcpServer(userId);
});

const resourceUrl = env.MCP_RESOURCE_URL || "https://mcp.baretext.app/mcp";
const betterAuthUrl = env.BETTER_AUTH_URL || "https://api.baretext.app";

const protectedHandler = createMcpProtectedRequestHandler(
  {
    issuer: betterAuthUrl,
    audience: resourceUrl,
    jwksUrl: `${betterAuthUrl}/api/auth/jwks`,
  },
  async (request, claims) => {
    return mcpHandler.fetch(request, {
      authInfo: { clientId: claims.sub },
    });
  },
);
async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // 1. RFC 9728 Protected Resource Metadata Discovery
  if (
    url.pathname === "/.well-known/oauth-protected-resource" ||
    url.pathname === "/.well-known/oauth-protected-resource/mcp"
  ) {
    return Response.json(
      {
        resource: resourceUrl,
        authorization_servers: [betterAuthUrl],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }

  // 2. Health check
  if (url.pathname === "/health") {
    return Response.json({
      status: "ok",
      service: "baretext-mcp",
      resource: resourceUrl,
    });
  }

  // 3. DNS Rebinding / Host Header validation
  const allowedHosts =
    Array.isArray(env.ALLOWED_HOSTS) && env.ALLOWED_HOSTS.length > 0
      ? env.ALLOWED_HOSTS
      : ["mcp.baretext.app", "localhost", "127.0.0.1"];
  const hostViolation = hostHeaderValidationResponse(request, allowedHosts);
  if (hostViolation) {
    return hostViolation;
  }

  // 4. Local dev bypass / Static Token validation
  const authHeader = request.headers.get("authorization");
  let localUserId = request.headers.get("x-user-id") || env.BARETEXT_USER_ID;

  if (env.MCP_AUTH_TOKEN && authHeader === `Bearer ${env.MCP_AUTH_TOKEN}`) {
    if (!localUserId) {
      localUserId = (await NoteDb.getDefaultUserId()) ?? undefined;
    }
    if (localUserId) {
      return mcpHandler.fetch(request, {
        authInfo: { clientId: localUserId },
      });
    }
  }

  // In local development, if no Bearer token is provided, auto-resolve default user
  if (
    process.env.NODE_ENV !== "production" &&
    !authHeader?.startsWith("Bearer ")
  ) {
    if (!localUserId) {
      localUserId = (await NoteDb.getDefaultUserId()) ?? undefined;
    }
    if (localUserId) {
      return mcpHandler.fetch(request, {
        authInfo: { clientId: localUserId },
      });
    }
  }

  // 5. OAuth Protected Request Handler (verifies Bearer JWT via JWKS or challenges 401)
  return protectedHandler(request);
}

process.on("SIGINT", async () => {
  await mcpHandler.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await mcpHandler.close();
  process.exit(0);
});

export default {
  port: env.PORT,
  hostname: env.HOST,
  fetch: handleRequest,
};
