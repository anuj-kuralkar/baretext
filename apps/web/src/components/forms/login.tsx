"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeftIcon, FingerprintIcon, MailIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";

type Step = "methods" | "email" | "otp";
type SlideDirection = "left" | "right" | "up" | "down";
type SocialProvider = "google" | "github";

export function LoginForm() {
  const [step, setStep] = useState<Step>("methods");
  const [direction, setDirection] = useState<SlideDirection>("left");

  // Social & passkey loading states
  const [loadingProvider, setLoadingProvider] = useState<
    SocialProvider | "passkey" | null
  >(null);

  // Email state
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // OTP state
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handlePasskeyLogin = async () => {
    setLoadingProvider("passkey");
    const { error } = await authClient.signIn.passkey();
    setLoadingProvider(null);

    if (error) {
      toast.add({
        type: "error",
        title: error.message ?? error.statusText,
      });
      return;
    }

    window.location.href = "/";
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    setLoadingProvider(provider);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: `${window.location.origin}/`,
      errorCallbackURL: `${window.location.origin}/login`,
    });
    setLoadingProvider(null);

    if (error) {
      toast.add({
        type: "error",
        title: error.message ?? error.statusText,
      });
    }
  };

  const sendOtp = async (targetEmail: string) => {
    setIsSendingOtp(true);
    setEmailError(null);

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: targetEmail,
      type: "sign-in",
    });

    setIsSendingOtp(false);

    if (error) {
      const message =
        error.message ?? error.statusText ?? "Failed to send code";
      setEmailError(message);
      toast.add({
        type: "error",
        title: message,
      });
      return false;
    }

    setCountdown(30);
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed?.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }

    const success = await sendOtp(trimmed);
    if (success) {
      setDirection("up");
      setStep("otp");
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (code.length !== 6 || isVerifyingOtp) return;

    setIsVerifyingOtp(true);
    setOtpError(null);

    const { error } = await authClient.signIn.emailOtp({
      email: email.trim(),
      otp: code,
    });

    setIsVerifyingOtp(false);

    if (error) {
      const message = error.message ?? "Invalid or expired verification code";
      setOtpError(message);
      toast.add({
        type: "error",
        title: message,
      });
      return;
    }

    window.location.href = "/";
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isSendingOtp) return;
    setOtp("");
    setOtpError(null);
    const success = await sendOtp(email.trim());
    if (success) {
      toast.add({
        type: "success",
        title: "A fresh verification code was sent to your email",
      });
    }
  };

  const isPending = loadingProvider !== null;

  // Animation classes depending on navigation direction
  const animationClass =
    direction === "left"
      ? "animate-in fade-in slide-in-from-right-6 duration-200"
      : direction === "right"
        ? "animate-in fade-in slide-in-from-left-6 duration-200"
        : direction === "up"
          ? "animate-in fade-in slide-in-from-bottom-6 duration-250"
          : "animate-in fade-in slide-in-from-top-6 duration-200";

  return (
    <Card className="w-full overflow-hidden">
      {step === "methods" && (
        <div key="methods" className={animationClass}>
          <CardHeader className="text-center">
            <CardTitle className="font-extrabold text-2xl tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm">
              Hop back in and keep writing.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("google")}
              disabled={isPending}
            >
              {loadingProvider === "google" ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <GoogleIcon data-icon="inline-start" />
              )}
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("github")}
              disabled={isPending}
            >
              {loadingProvider === "github" ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <GithubIcon data-icon="inline-start" />
              )}
              Sign in with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setDirection("left");
                setStep("email");
              }}
              disabled={isPending}
            >
              <MailIcon data-icon="inline-start" />
              Sign in with Email
            </Button>
            <div className="flex items-center justify-center gap-2">
              <Separator />
              <span className="text-muted-foreground text-xs">Or</span>
              <Separator />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handlePasskeyLogin}
              disabled={isPending}
            >
              {loadingProvider === "passkey" ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <FingerprintIcon data-icon="inline-start" />
              )}
              Sign in with Passkey
            </Button>
          </CardContent>
        </div>
      )}

      {step === "email" && (
        <div key="email" className={animationClass}>
          <CardHeader className="relative text-center">
            <Button
              variant="ghost"
              size="icon-xs"
              className="absolute top-6 left-5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setDirection("right");
                setStep("methods");
                setEmailError(null);
              }}
              aria-label="Back to sign-in options"
            >
              <ArrowLeftIcon />
            </Button>
            <CardTitle className="font-extrabold text-2xl tracking-tight">
              Sign in with email
            </CardTitle>
            <CardDescription className="text-sm">
              We'll send a 6-digit verification code to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="email-input">Email address</FieldLabel>
                <Input
                  id="email-input"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  autoFocus
                  disabled={isSendingOtp}
                  aria-invalid={!!emailError}
                />
                {emailError && <FieldError>{emailError}</FieldError>}
              </Field>
              <Button
                type="submit"
                className="w-full"
                disabled={isSendingOtp || !email.trim()}
              >
                {isSendingOtp ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Sending code...
                  </>
                ) : (
                  "Continue with code"
                )}
              </Button>
            </form>
          </CardContent>
        </div>
      )}

      {step === "otp" && (
        <div key="otp" className={animationClass}>
          <CardHeader className="relative text-center">
            <Button
              variant="ghost"
              size="icon-xs"
              className="absolute top-6 left-5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setDirection("down");
                setStep("email");
                setOtp("");
                setOtpError(null);
              }}
              aria-label="Change email"
            >
              <ArrowLeftIcon />
            </Button>
            <CardTitle className="font-extrabold text-2xl tracking-tight">
              Check your email
            </CardTitle>
            <CardDescription className="text-sm">
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
                    handleVerifyOtp(val);
                  }
                }}
                disabled={isVerifyingOtp}
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
                <p className="mt-2 text-center font-medium text-destructive text-xs">
                  {otpError}
                </p>
              )}
            </div>

            <Button
              className="w-full"
              onClick={() => handleVerifyOtp(otp)}
              disabled={otp.length !== 6 || isVerifyingOtp}
            >
              {isVerifyingOtp ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Verifying...
                </>
              ) : (
                "Verify & Sign in"
              )}
            </Button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-muted-foreground text-xs">
                  Resend code in{" "}
                  <span className="font-medium text-foreground">
                    {countdown}s
                  </span>
                </p>
              ) : (
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-muted-foreground text-xs hover:text-foreground"
                  onClick={handleResendOtp}
                  disabled={isSendingOtp}
                >
                  {isSendingOtp ? "Sending new code..." : "Resend code"}
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      )}
    </Card>
  );
}
