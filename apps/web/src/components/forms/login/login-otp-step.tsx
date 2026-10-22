"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
import { useLoginForm } from "./login-context";

export function LoginOtpStep() {
  const { email, goToEmail } = useLoginForm();
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const verifyOtp = async (codeToVerify: string) => {
    const code = codeToVerify.trim();
    if (code.length !== 6 || isVerifying) return;

    setIsVerifying(true);
    setOtpError(null);

    const { error } = await authClient.signIn.emailOtp({
      email,
      otp: code,
    });

    setIsVerifying(false);

    if (error) {
      setOtpError(error.message ?? "Invalid or expired verification code");
      return;
    }

    window.location.href = "/";
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setOtp("");
    setOtpError(null);
    setIsResending(true);

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    setIsResending(false);

    if (error) {
      setOtpError(error.message ?? error.statusText ?? "Failed to resend code");
      return;
    }

    setCountdown(30);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-extrabold text-2xl tracking-tight">
          Check your email
        </CardTitle>
        <CardDescription>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center justify-center py-2">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (otpError) setOtpError(null);
              if (val.length === 6) {
                verifyOtp(val);
              }
            }}
            disabled={isVerifying}
            autoFocus
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} aria-invalid={!!otpError} />
              <InputOTPSlot index={1} aria-invalid={!!otpError} />
              <InputOTPSlot index={2} aria-invalid={!!otpError} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} aria-invalid={!!otpError} />
              <InputOTPSlot index={4} aria-invalid={!!otpError} />
              <InputOTPSlot index={5} aria-invalid={!!otpError} />
            </InputOTPGroup>
          </InputOTP>

          {otpError && (
            <p className="mt-2 text-center font-medium text-destructive text-sm">
              {otpError}
            </p>
          )}
        </div>

        <Button
          className="w-full"
          onClick={() => verifyOtp(otp)}
          disabled={otp.length !== 6 || isVerifying}
        >
          {isVerifying ? (
            <>
              <Spinner data-icon="inline-start" />
              Verifying...
            </>
          ) : (
            "Verify & Sign in"
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={handleResend}
          disabled={isResending || countdown > 0}
        >
          {countdown > 0
            ? `Resend code in ${countdown}s`
            : isResending
              ? "Sending code..."
              : "Resend code"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={goToEmail}
          disabled={isVerifying}
        >
          Change email
        </Button>
      </CardContent>
    </Card>
  );
}
