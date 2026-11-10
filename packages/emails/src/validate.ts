import { resolveMx, resolveTxt } from "node:dns/promises";
import { z } from "zod";

const emailSchema = z.email("Invalid email address format.");

/**
 * Marks rejections the checker itself decided on. The catch block rethrows
 * these by type instead of by matching message text.
 */
export class EmailDeliveryRejected extends Error {}

const DISPOSABLE_EMAIL_MESSAGE =
  "Disposable email addresses are not supported.";
const NO_MAILBOX_MESSAGE = "This email domain cannot receive incoming mail.";
const DOMAIN_NOT_FOUND_MESSAGE = "The specified email domain does not exist.";

// Node DNS codes meaning "the domain itself does not resolve". The raw code
// is also searched for in `error.message`, because some DNS layers report it
// only there (e.g. "queryMx ENOTFOUND non-existent.domain").
const DOMAIN_NOT_FOUND_CODES: readonly string[] = [
  "ENOTFOUND",
  "ENODATA",
  "DNS_ENOTFOUND",
  "DNS_ENODATA",
];

export interface DnsResolver {
  resolveMx(
    domain: string,
  ): Promise<Array<{ exchange: string; priority: number }>>;
  resolveTxt(domain: string): Promise<string[][]>;
}

export const systemDnsResolver: DnsResolver = {
  resolveMx,
  resolveTxt,
};

/**
 * Options overriding network and blocklist sources; both default to the real
 * system resolver and the bundled `disposable-domains.txt` list. Test passes
 * inject fakes here.
 */
export interface ValidateEmailOptions {
  dnsResolver?: DnsResolver;
  disposableDomains?: ReadonlySet<string>;
}

import disposableDomainsText from "./disposable-domains.txt";

let disposableSet: ReadonlySet<string> | null = null;

function getDisposableSet(): ReadonlySet<string> {
  if (disposableSet) return disposableSet;

  disposableSet = new Set(
    disposableDomainsText
      .split("\n")
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean),
  );

  return disposableSet;
}

export const BURNER_MX_KEYWORDS = [
  "temp-mail",
  "mailinator",
  "guerrillamail",
  "10minutemail",
  "burnermail",
  "trashmail",
  "sharklasers",
  "yopmail",
  "dispostable",
  "agaexpress",
] as const;

/**
 * True when a lookup error means the domain itself does not resolve — either
 * via the errno code, or via the code some DNS layers echo only in the message.
 */
const isDomainNotFoundLookupError = (
  error: Error,
  code: string | undefined,
): boolean =>
  (code && DOMAIN_NOT_FOUND_CODES.includes(code)) ||
  DOMAIN_NOT_FOUND_CODES.some((errorCode) => error.message.includes(errorCode));

/**
 * Validates an account email for deliverability: syntactic shape, static
 * disposable-domain blocklist, resolvability of MX records, burner-MX hosts
 * and the dummy-SPF signature.
 *
 * Returns the email normalized (trimmed, lowercased). Throws
 * {@link EmailDeliveryRejected} with a user-facing message for each rejection
 * reason. Transient DNS failures (SERVFAIL, timeouts) fail soft: they are
 * logged and the email is accepted.
 */
export async function validateEmailDeliverability(
  email: string,
  options: ValidateEmailOptions = {},
): Promise<string> {
  const normalized = email.trim().toLowerCase();
  if (!emailSchema.validate(normalized)) {
    throw new Error("Invalid email address format");
  }
  const domain = normalized.slice(normalized.lastIndexOf("@") + 1);

  // 1. Static Blocklist check (< 0.01ms)
  const set = options.disposableDomains ?? getDisposableSet();
  if (set.has(domain)) {
    throw new EmailDeliveryRejected(DISPOSABLE_EMAIL_MESSAGE);
  }

  // 2. DNS MX records check
  const resolver = options.dnsResolver ?? systemDnsResolver;
  try {
    const mx = await resolver.resolveMx(domain);

    // The single empty-exchange MX is the null-MX placeholder some
    // disposable networks rely on; it must not pass the deliverability check.
    if (!mx?.length || (mx.length === 1 && !mx[0]?.exchange)) {
      throw new EmailDeliveryRejected(NO_MAILBOX_MESSAGE);
    }

    const isBurnerHost = mx.some((record) =>
      BURNER_MX_KEYWORDS.some((keyword) =>
        record.exchange.toLowerCase().includes(keyword),
      ),
    );

    if (isBurnerHost) {
      throw new EmailDeliveryRejected(DISPOSABLE_EMAIL_MESSAGE);
    }

    // 3. Check for dummy SPF record signature (temp-mail networks commonly use ip4:1.1.1.1).
    // A domain with no TXT records at all is the normal "no SPF" case, so the
    // lookup error maps to "no records" instead of aborting the check.
    const txtRecords = await resolver.resolveTxt(domain).catch(() => []);
    const hasDummySpf = txtRecords.some((txt) =>
      txt.some((t) => t.includes("ip4:1.1.1.1")),
    );

    if (hasDummySpf) {
      throw new EmailDeliveryRejected(DISPOSABLE_EMAIL_MESSAGE);
    }
  } catch (error: unknown) {
    if (error instanceof EmailDeliveryRejected) {
      throw error;
    }

    if (error instanceof Error) {
      if ("code" in error) {
        const code = error.code;
        if (
          typeof code === "string" &&
          isDomainNotFoundLookupError(error, code)
        ) {
          throw new EmailDeliveryRejected(DOMAIN_NOT_FOUND_MESSAGE);
        }
      } else if (isDomainNotFoundLookupError(error, undefined)) {
        throw new EmailDeliveryRejected(DOMAIN_NOT_FOUND_MESSAGE);
      }

      // Fail-soft on transient DNS failures (SERVFAIL, timeouts): a flaky
      // resolver must not lock real users out of sign-in.
      console.warn(`[AUTH] DNS MX lookup skipped: ${error.message}`);
    }
  }

  return normalized;
}
