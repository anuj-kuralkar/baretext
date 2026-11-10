import z from "zod";

/**
 * Zod codec between an ISO-8601 datetime string and a `Date`: decode parses
 * wire/json timestamps into `Date`, encode serializes back to ISO strings.
 */
export const isoDatetimeToDate = z.codec(z.iso.datetime(), z.date(), {
  decode: (isoString) => new Date(isoString),
  encode: (date) => date.toISOString(),
});
