import { Elysia, problem } from "elysia";
import { auth } from "../../lib/auth/server";

export const betterAuth = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async derive({ request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });
        if (!session) return problem(401, { detail: "Unauthorized" });
        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });
