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
        <Body className="bg-brand-bg text-brand-text m-0 p-0 font-sans">
          <Preview>Your Baretext verification code: {otp}</Preview>
          <Container className="mx-auto max-w-120 px-6 py-12">
            {/* Brand Wordmark */}
            <Text className="text-brand-muted m-0 mb-8 text-xs font-semibold tracking-[0.2em] uppercase">
              Baretext
            </Text>

            {/* Heading */}
            <Heading className="text-brand-text m-0 mb-3 text-2xl font-bold tracking-tight">
              Your sign-in code
            </Heading>
            <Text className="text-brand-dim m-0 mb-8 text-sm leading-6">
              Enter this verification code to complete sign in for{" "}
              <span className="text-brand-text font-medium">{email}</span>.
            </Text>

            {/* OTP Display Box */}
            <Section className="border-brand-border bg-brand-card mb-8 rounded-xl border border-solid px-6 py-7 text-center">
              <Text className="text-brand-text m-0 font-mono text-3xl font-bold tracking-[0.35em]">
                {otp}
              </Text>
            </Section>

            {/* Expiry Details */}
            <Text className="text-brand-muted m-0 mb-8 text-xs leading-5">
              This code expires in{" "}
              <span className="text-brand-dim font-medium">
                {expiresInMinutes} minutes
              </span>
              . For security, never forward or share this code with anyone.
            </Text>

            <Hr className="border-brand-border m-0 mb-6 border-solid" />

            {/* Footer */}
            <Text className="text-brand-muted m-0 text-xs leading-5">
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
