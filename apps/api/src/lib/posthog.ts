import { PostHog } from "posthog-node";
import { env } from "./env";

const missingVariable = !env.POSTHOG_PROJECT_TOKEN
  ? "POSTHOG_PROJECT_TOKEN"
  : !env.POSTHOG_HOST
    ? "POSTHOG_HOST"
    : undefined;

if (missingVariable && process.env.NODE_ENV !== "production") {
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export const posthog =
  env.POSTHOG_PROJECT_TOKEN && env.POSTHOG_HOST
    ? new PostHog(env.POSTHOG_PROJECT_TOKEN, {
        host: env.POSTHOG_HOST,
        enableExceptionAutocapture: true,
      })
    : undefined;
