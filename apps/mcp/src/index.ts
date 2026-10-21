import { createMcpProtectedRequestHandler } from "@better-auth/mcp";
import {
  createMcpHandler,
  hostHeaderValidationResponse,
} from "@modelcontextprotocol/server";
import { env } from "./env";
import { createBaretextMcpServer } from "./server";

const mcpHandler = createMcpHandler(({ authInfo }) => {
  const userId = (authInfo?.clientId as string) || env.BARETEXT_USER_ID;
  if (!userId) {
    throw new Error("Unauthenticated: no user ID resolved");
  }
  return createBaretextMcpServer(userId);
});

function getProtectedHandler(request: Request) {
  const url = new URL(request.url);
  const isLoopback =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "::1";

  const audience = isLoopback
    ? `${url.origin}/mcp`
    : env.MCP_RESOURCE_URL || "https://mcp.baretext.app/mcp";

  const issuer = isLoopback
    ? process.env.LOCAL_BETTER_AUTH_URL || "http://localhost:8080"
    : env.BETTER_AUTH_URL || "https://api.baretext.app";

  const jwksUrl = `${issuer}/api/auth/jwks`;

  return createMcpProtectedRequestHandler(
    {
      issuer,
      audience,
      jwksUrl,
    },
    async (req, claims) => {
      return mcpHandler.fetch(req, {
        authInfo: { clientId: claims.sub },
      });
    },
  );
}

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const isLoopback =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "::1";

  // 1. RFC 9728 Protected Resource Metadata Discovery
  if (
    url.pathname === "/.well-known/oauth-protected-resource" ||
    url.pathname === "/.well-known/oauth-protected-resource/mcp"
  ) {
    const resource = isLoopback
      ? `${url.origin}/mcp`
      : env.MCP_RESOURCE_URL || "https://mcp.baretext.app/mcp";

    const authServer = isLoopback
      ? process.env.LOCAL_BETTER_AUTH_URL || "http://localhost:8080"
      : env.BETTER_AUTH_URL || "https://api.baretext.app";

    return Response.json(
      {
        resource,
        authorization_servers: [authServer],
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

  // 4. Local dev with explicit secret token and user ID
  const authHeader = request.headers.get("authorization");
  const explicitUserId =
    request.headers.get("x-user-id") || env.BARETEXT_USER_ID;

  if (
    env.MCP_AUTH_TOKEN &&
    authHeader === `Bearer ${env.MCP_AUTH_TOKEN}` &&
    explicitUserId
  ) {
    return mcpHandler.fetch(request, {
      authInfo: { clientId: explicitUserId },
    });
  }

  // 5. OAuth Protected Request Handler (verifies Better Auth Bearer JWT via JWKS or challenges 401)
  return getProtectedHandler(request)(request);
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
