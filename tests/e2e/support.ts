import { testAuth } from "@baretext/auth/test";
import type { BrowserContext } from "@playwright/test";

export interface E2EUserSession {
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly name: string;
  };
  cleanup: () => Promise<void>;
}

export async function createAuthenticatedUser(
  context: BrowserContext,
  overrides: { email?: string; name?: string } = {},
): Promise<E2EUserSession> {
  const ctx = await testAuth.$context;
  const user = ctx.test.createUser({
    email: overrides.email ?? `e2e-${crypto.randomUUID()}@example.com`,
    name: overrides.name ?? "E2E User",
    emailVerified: true,
  });
  const savedUser = await ctx.test.saveUser(user);

  const cookies = await ctx.test.getCookies({
    userId: savedUser.id,
    domain: "localhost",
  });
  await context.addCookies(cookies);

  return {
    user: savedUser,
    cleanup: async () => {
      await ctx.test.deleteUser(savedUser.id);
    },
  };
}
