import { auth } from "@baretext/auth";
import { Elysia, problem } from "elysia";
import { posthog } from "../../lib/posthog";

export const betterAuth = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async derive({ request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });
        if (!session) return problem(401, { detail: "Unauthorized" });

        posthog?.enterContext({ distinctId: session.user.id }, { fresh: true });

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });
