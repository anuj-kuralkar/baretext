# 0004. Auth Testing Strategy

We rely on Better Auth's official `testUtils` plugin (`@baretext/auth/test`) with Vitest and Playwright E2E integration rather than custom client-side auth adapters or mocks.

Mocking authentication clients in frontend UI tests introduces hypothetical seams that diverge from production runtime behavior. Custom client wrappers require maintaining fake token states, artificial network latencies, and out-of-sync session cookie models, adding dead weight without catching real authentication regressions.

Better Auth provides the `testUtils` plugin with passive OTP capture (`captureOTP: true`), session generation (`getAuthHeaders`, `getCookies`), and user lifecycle helpers (`createUser`, `saveUser`, `deleteUser`). Keeping `testUtils` in `@baretext/auth/test` keeps test helpers out of production bundles while allowing Vitest integration tests and Playwright E2E suites in `tests/e2e` to exercise real auth flows against an isolated Neon branch.
