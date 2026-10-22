import { z } from "zod";

const emailSchema = z.email("Invalid email address format.");

interface MxRecord {
  priority: number;
  exchange: string;
}

interface BunDnsExtended {
  resolveMx: (hostname: string) => Promise<MxRecord[]>;
}

export async function validateEmailDeliverability(
  email: string,
): Promise<string> {
  const normalized = emailSchema.parse(email.trim()).toLowerCase();
  const domain = normalized.slice(normalized.lastIndexOf("@") + 1);

  try {
    const dns = Bun.dns as unknown as BunDnsExtended;
    const mx = await dns.resolveMx(domain);

    if (!mx || mx.length === 0 || (mx.length === 1 && !mx[0]?.exchange)) {
      throw new Error("This email domain cannot receive incoming mail.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("cannot receive")) {
        throw error;
      }

      const code = "code" in error ? (error.code as string) : undefined;
      if (
        code === "DNS_ENOTFOUND" ||
        code === "DNS_ENODATA" ||
        error.message.includes("ENOTFOUND")
      ) {
        throw new Error("The specified email domain does not exist.");
      }

      console.warn(`[AUTH] Bun.dns.resolveMx lookup skipped: ${error.message}`);
    }
  }

  return normalized;
}
