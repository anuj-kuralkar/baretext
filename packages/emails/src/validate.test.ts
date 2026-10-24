import { describe, expect, it } from "vitest";
import { type DnsResolver, validateEmailDeliverability } from "./validate";

function createFakeDnsResolver(overrides: {
  mx?: Array<{ exchange: string; priority: number }>;
  txt?: string[][];
  error?: Error;
}): DnsResolver {
  return {
    resolveMx: async () => {
      if (overrides.error) throw overrides.error;
      return overrides.mx ?? [{ exchange: "mail.example.com", priority: 10 }];
    },
    resolveTxt: async () => {
      return overrides.txt ?? [["v=spf1 include:_spf.example.com ~all"]];
    },
  };
}

describe("validateEmailDeliverability", () => {
  it("rejects invalid email syntax format", async () => {
    await expect(validateEmailDeliverability("not-an-email")).rejects.toThrow(
      "Invalid email address format.",
    );
    await expect(
      validateEmailDeliverability("missing-domain@"),
    ).rejects.toThrow("Invalid email address format.");
  });

  it("rejects static disposable blocklist domains", async () => {
    await expect(
      validateEmailDeliverability("user@temp-mail.org", {
        disposableDomains: new Set(["temp-mail.org"]),
        dnsResolver: createFakeDnsResolver({}),
      }),
    ).rejects.toThrow("Disposable email addresses are not supported.");
  });

  it("rejects domains with empty MX records", async () => {
    const resolver = createFakeDnsResolver({ mx: [] });
    await expect(
      validateEmailDeliverability("user@no-mx.com", {
        dnsResolver: resolver,
        disposableDomains: new Set(),
      }),
    ).rejects.toThrow("This email domain cannot receive incoming mail.");
  });

  it("rejects domains with null MX record", async () => {
    const resolver = createFakeDnsResolver({
      mx: [{ exchange: "", priority: 0 }],
    });
    await expect(
      validateEmailDeliverability("user@null-mx.com", {
        dnsResolver: resolver,
        disposableDomains: new Set(),
      }),
    ).rejects.toThrow("This email domain cannot receive incoming mail.");
  });

  it("rejects burner MX host keywords", async () => {
    const resolver = createFakeDnsResolver({
      mx: [{ exchange: "smtp.mailinator.com", priority: 10 }],
    });
    await expect(
      validateEmailDeliverability("user@custom-domain.com", {
        dnsResolver: resolver,
        disposableDomains: new Set(),
      }),
    ).rejects.toThrow("Disposable email addresses are not supported.");
  });

  it("rejects dummy SPF signature (ip4:1.1.1.1)", async () => {
    const resolver = createFakeDnsResolver({
      txt: [["v=spf1 ip4:1.1.1.1 -all"]],
    });
    await expect(
      validateEmailDeliverability("user@dummy-spf.com", {
        dnsResolver: resolver,
        disposableDomains: new Set(),
      }),
    ).rejects.toThrow("Disposable email addresses are not supported.");
  });

  it("rejects non-existent domain with ENOTFOUND", async () => {
    const notFoundError = new Error("queryMx ENOTFOUND non-existent.domain");
    Object.assign(notFoundError, { code: "ENOTFOUND" });

    const resolver = createFakeDnsResolver({ error: notFoundError });
    await expect(
      validateEmailDeliverability("user@non-existent.domain", {
        dnsResolver: resolver,
        disposableDomains: new Set(),
      }),
    ).rejects.toThrow("The specified email domain does not exist.");
  });

  it("accepts valid deliverable domain and returns normalized email", async () => {
    const resolver = createFakeDnsResolver({
      mx: [{ exchange: "aspmx.l.google.com", priority: 1 }],
      txt: [["v=spf1 include:_spf.google.com ~all"]],
    });

    const result = await validateEmailDeliverability(
      "  User.Test@Gmail.COM  ",
      {
        dnsResolver: resolver,
        disposableDomains: new Set(),
      },
    );

    expect(result).toBe("user.test@gmail.com");
  });
});
