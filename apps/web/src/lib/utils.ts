// Breakpoints and divisors for the relative-time buckets; each unit pairs
// with the next coarser unit's exact size.
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;

export function getInitials(name?: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export function formatRelativeTime(date: string | Date | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", {
    style: "narrow",
    numeric: "always",
  });

  if (Math.abs(diffInSeconds) < SECONDS_PER_MINUTE) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / SECONDS_PER_MINUTE);
  if (Math.abs(diffInMinutes) < MINUTES_PER_HOUR) {
    return rtf.format(-diffInMinutes, "minute");
  }

  const diffInHours = Math.floor(diffInMinutes / MINUTES_PER_HOUR);
  if (Math.abs(diffInHours) < HOURS_PER_DAY) {
    return rtf.format(-diffInHours, "hour");
  }

  const diffInDays = Math.floor(diffInHours / HOURS_PER_DAY);
  if (Math.abs(diffInDays) < DAYS_PER_WEEK) {
    return rtf.format(-diffInDays, "day");
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: now.getFullYear() !== d.getFullYear() ? "numeric" : undefined,
  }).format(d);
}
