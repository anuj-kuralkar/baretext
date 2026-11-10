import { describe, expect, it } from "vitest";
import {
  type EmailSender,
  MemoryEmailSender,
  sendSignInOtpEmail,
} from "./send";

describe("sendSignInOtpEmail", () => {
  it("dispatches OTP email to MemoryEmailSender and records payload", async () => {
    const memorySender = new MemoryEmailSender();

    const response = await sendSignInOtpEmail(
      {
        email: "  Person@Domain.COM  ",
        otp: "654321",
      },
      {
        sender: memorySender,
      },
    );

    expect(response).toBeDefined();
    // Matches MemoryEmailSender ids of the form "mock-<timestamp>-<n>": "mock-1767139200000-1" matches, "res_abc123" rejects.
    // https://regex101.com/?flavor=javascript&regex=%5Emock-&flags=g&testString=mock-1767139200000-1%0Ares_abc123
    expect(response.id).toMatch(/^mock-/);

    expect(memorySender.sent).toHaveLength(1);
    const sent = memorySender.sent[0];
    if (!sent) throw new Error("Expected one recorded email");
    expect(sent.to).toEqual(["person@domain.com"]);
    expect(sent.subject).toBe("Your login code - Baretext");
    expect(sent.react).toBeDefined();
  });

  it("propagates transport errors when sender fails", async () => {
    const failingSender: EmailSender = {
      send: async () => {
        throw new Error("Network timeout contacting SMTP/API");
      },
    };

    await expect(
      sendSignInOtpEmail(
        {
          email: "user@example.com",
          otp: "123456",
        },
        {
          sender: failingSender,
        },
      ),
    ).rejects.toThrow("Network timeout contacting SMTP/API");
  });

  it("allows clearing recorded emails in MemoryEmailSender", async () => {
    const memorySender = new MemoryEmailSender();

    await sendSignInOtpEmail(
      { email: "user@example.com", otp: "111111" },
      { sender: memorySender },
    );
    expect(memorySender.sent).toHaveLength(1);

    memorySender.clear();
    expect(memorySender.sent).toHaveLength(0);
  });
});
