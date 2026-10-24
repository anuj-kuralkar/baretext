# 0004. Auth Testing Strategy

We rely on Better Auth's official `testUtils` plugin and Vitest/Playwright browser integration rather than custom client-side auth adapters or mocks.

Mocking authentication clients in frontend UI tests introduces hypothetical seams that diverge from production runtime behavior. Custom client wrappers require maintaining fake token states, artificial network latencies, and out-of-sync session cookie models, adding dead weight without catching real authentication regressions.

Better Auth provides the `testUtils` plugin with passive OTP capture (`captureOTP: true`), session generation (`getAuthHeaders`, `getCookies`), and user lifecycle helpers. Combined with the existing Playwright browser runner in `apps/web/vitest.config.ts`, frontend tests can exercise the actual `LoginForm` and authentication flow against the real auth client and inspect captured verification codes without external network dependencies.
