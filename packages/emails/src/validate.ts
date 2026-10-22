import { resolveMx, resolveTxt } from "node:dns/promises";
import { z } from "zod";

const emailSchema = z.email("Invalid email address format.");

let disposableSet: Set<string> | null = null;

async function getDisposableSet(): Promise<Set<string>> {
  if (disposableSet) return disposableSet;

  try {
    const file = Bun.file(new URL("./disposable-domains.txt", import.meta.url));
    const text = await file.text();
    disposableSet = new Set(
      text
        .split("\n")
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean),
    );
  } catch (error) {
    console.warn("[AUTH] Could not load disposable-domains.txt:", error);
    disposableSet = new Set();
  }

  return disposableSet;
}

const BURNER_MX_KEYWORDS = [
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
];

export async function validateEmailDeliverability(
  email: string,
): Promise<string> {
  const normalized = emailSchema.parse(email.trim()).toLowerCase();
  const domain = normalized.slice(normalized.lastIndexOf("@") + 1);

  // 1. Static Blocklist check (< 0.01ms)
  const set = await getDisposableSet();
  if (set.has(domain)) {
    throw new Error("Disposable email addresses are not supported.");
  }

  // 2. DNS MX records check (~20-40ms)
  try {
    const mx = await resolveMx(domain);

    if (!mx || mx.length === 0 || (mx.length === 1 && !mx[0]?.exchange)) {
      throw new Error("This email domain cannot receive incoming mail.");
    }

    const isBurnerHost = mx.some((record) =>
      BURNER_MX_KEYWORDS.some((kw) =>
        record.exchange.toLowerCase().includes(kw),
      ),
    );

    if (isBurnerHost) {
      throw new Error("Disposable email addresses are not supported.");
    }

    // 3. Check for dummy SPF record signature (temp-mail networks commonly use ip4:1.1.1.1)
    const txtRecords = await resolveTxt(domain).catch(() => []);
    const hasDummySpf = txtRecords.some((txt) =>
      txt.some((t) => t.includes("ip4:1.1.1.1")),
    );

    if (hasDummySpf) {
      throw new Error("Disposable email addresses are not supported.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (
        error.message.includes("not supported") ||
        error.message.includes("cannot receive")
      ) {
        throw error;
      }

      const code = "code" in error ? (error.code as string) : undefined;
      if (
        code === "ENOTFOUND" ||
        code === "ENODATA" ||
        code === "DNS_ENOTFOUND" ||
        code === "DNS_ENODATA" ||
        error.message.includes("ENOTFOUND")
      ) {
        throw new Error("The specified email domain does not exist.");
      }

      console.warn(`[AUTH] DNS MX lookup skipped: ${error.message}`);
    }
  }

  return normalized;
}
