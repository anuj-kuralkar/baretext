import { testAuth } from "@baretext/auth/test";
import { expect, test } from "@playwright/test";
import { createAuthenticatedUser } from "./support";

test.describe("authentication", () => {
  test("redirects unauthenticated visitors from /notes to /login", async ({
    page,
  }) => {
    await page.goto("/notes");

    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByRole("button", { name: /Sign in with Email/i }),
    ).toBeVisible();
  });

  test("allows authenticated sessions injected via Better Auth testUtils cookies", async ({
    context,
    page,
  }) => {
    const session = await createAuthenticatedUser(context, {
      name: "Playwright Writer",
    });

    try {
      await page.goto("/notes");
      await expect(page).toHaveURL(/\/notes$/);

      await page.goto("/login");
      await expect(page).toHaveURL(/\/notes$/);
    } finally {
      await session.cleanup();
    }
  });

  test("captures and verifies OTP codes using Better Auth testUtils", async () => {
    const ctx = await testAuth.$context;
    ctx.test.clearOTPs?.();

    const email = `otp-${crypto.randomUUID()}@gmail.com`;
    const user = ctx.test.createUser({ email, emailVerified: false });
    const saved = await ctx.test.saveUser(user);

    try {
      await testAuth.api.sendVerificationOTP({
        body: { email, type: "sign-in" },
      });

      const otp = ctx.test.getOTP?.(email);
      expect(otp).toMatch(/^\d{6}$/);
      if (!otp) throw new Error("Expected captured OTP");

      const signedIn = await testAuth.api.signInEmailOTP({
        body: { email, otp },
      });
      expect(signedIn.user.id).toBe(saved.id);
    } finally {
      await ctx.test.deleteUser(saved.id);
    }
  });
});
