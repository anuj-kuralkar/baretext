import { Resend } from "resend";
import { env } from "./env";
import { SignInOtpEmail } from "./templates/sign-in-otp";

export async function sendSignInOtpEmail({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  if (!env.RESEND_API_KEY) {
    console.warn(
      `[AUTH] RESEND_API_KEY not configured. Verification code for ${email} is: ${otp}`,
    );
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: [email],
    subject: "Your login code - Baretext",
    react: SignInOtpEmail({ email, otp, expiresInMinutes: 5 }),
  });

  if (error) {
    console.error("[AUTH] Resend failed to send verification OTP:", error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }

  return data;
}
