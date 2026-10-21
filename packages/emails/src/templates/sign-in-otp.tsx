import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from "react-email";

export interface SignInOtpEmailProps {
  email: string;
  otp: string;
  expiresInMinutes?: number;
}

export function SignInOtpEmail({
  email,
  otp,
  expiresInMinutes = 5,
}: SignInOtpEmailProps) {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: {
                  bg: "#09090b",
                  card: "#18181b",
                  border: "#27272a",
                  muted: "#71717a",
                  dim: "#a1a1aa",
                  text: "#fafafa",
                },
              },
            },
          },
        }}
      >
        <Head />
        <Body className="m-0 bg-brand-bg p-0 font-sans text-brand-text">
          <Preview>Your Baretext verification code: {otp}</Preview>
          <Container className="mx-auto max-w-120 px-6 py-12">
            {/* Brand Wordmark */}
            <Text className="m-0 mb-8 font-semibold text-brand-muted text-xs uppercase tracking-[0.2em]">
              Baretext
            </Text>

            {/* Heading */}
            <Heading className="m-0 mb-3 font-bold text-2xl text-brand-text tracking-tight">
              Your sign-in code
            </Heading>
            <Text className="m-0 mb-8 text-brand-dim text-sm leading-6">
              Enter this verification code to complete sign in for{" "}
              <span className="font-medium text-brand-text">{email}</span>.
            </Text>

            {/* OTP Display Box */}
            <Section className="mb-8 rounded-xl border border-brand-border border-solid bg-brand-card px-6 py-7 text-center">
              <Text className="m-0 font-bold font-mono text-3xl text-brand-text tracking-[0.35em]">
                {otp}
              </Text>
            </Section>

            {/* Expiry Details */}
            <Text className="m-0 mb-8 text-brand-muted text-xs leading-5">
              This code expires in{" "}
              <span className="font-medium text-brand-dim">
                {expiresInMinutes} minutes
              </span>
              . For security, never forward or share this code with anyone.
            </Text>

            <Hr className="m-0 mb-6 border-brand-border border-solid" />

            {/* Footer */}
            <Text className="m-0 text-brand-muted text-xs leading-5">
              If you did not request this login code, you can safely ignore this
              email. No changes have been made to your account.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

SignInOtpEmail.PreviewProps = {
  email: "alex@example.com",
  otp: "849201",
  expiresInMinutes: 5,
} satisfies SignInOtpEmailProps;

export default SignInOtpEmail;
