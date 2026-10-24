import type * as React from "react";
import { Resend } from "resend";
import { env } from "./env";
import { SignInOtpEmail } from "./templates/sign-in-otp";

export interface SendEmailPayload {
  from: string;
  to: string[];
  subject: string;
  react: React.ReactNode;
}

export interface EmailSender {
  send(payload: SendEmailPayload): Promise<{ id?: string }>;
}

export class ResendEmailSender implements EmailSender {
  private resend: Resend;

  constructor(apiKey: string = env.RESEND_API_KEY) {
    this.resend = new Resend(apiKey);
  }

  async send(payload: SendEmailPayload): Promise<{ id?: string }> {
    const { data, error } = await this.resend.emails.send({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      react: payload.react as React.ReactElement,
    });

    if (error) {
      console.error("[AUTH] Resend failed to send verification OTP:", error);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }

    return { id: data?.id };
  }
}

export class MemoryEmailSender implements EmailSender {
  public sent: SendEmailPayload[] = [];

  async send(payload: SendEmailPayload): Promise<{ id?: string }> {
    this.sent.push(payload);
    return { id: `mock-${Date.now()}-${this.sent.length}` };
  }

  clear(): void {
    this.sent = [];
  }
}

export interface SendSignInOtpOptions {
  sender?: EmailSender;
}

export async function sendSignInOtpEmail(
  {
    email,
    otp,
  }: {
    email: string;
    otp: string;
  },
  options: SendSignInOtpOptions = {},
) {
  const recipientEmail = email.trim().toLowerCase();
  const sender = options.sender ?? new ResendEmailSender();

  return await sender.send({
    from: env.AUTH_SENDER_EMAIL,
    to: [recipientEmail],
    subject: "Your login code - Baretext",
    react: SignInOtpEmail({ email: recipientEmail, otp, expiresInMinutes: 5 }),
  });
}
