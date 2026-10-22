"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";
import { LoginEmailStep } from "./login-email-step";
import { LoginMethodsStep } from "./login-methods-step";
import { LoginOtpStep } from "./login-otp-step";
import type { SlideDirection, SocialProvider, Step } from "./types";

export function LoginForm() {
  const [step, setStep] = useState<Step>("methods");
  const [direction, setDirection] = useState<SlideDirection>("left");

  // Social & passkey loading state
  const [loadingProvider, setLoadingProvider] = useState<
    SocialProvider | "passkey" | null
  >(null);

  // Email input state
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // OTP verification state
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for OTP resend cooldown
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

  const handleSelectEmail = () => {
    setDirection("left");
    setStep("email");
    setEmailError(null);
  };

  const handleBackToMethods = () => {
    setDirection("right");
    setStep("methods");
    setEmailError(null);
  };

  const handleBackToEmail = () => {
    setDirection("down");
    setStep("email");
    setOtp("");
    setOtpError(null);
  };

  // Motion direction classes
  const animationClass =
    direction === "left"
      ? "animate-in fade-in slide-in-from-right-6 duration-200"
      : direction === "right"
        ? "animate-in fade-in slide-in-from-left-6 duration-200"
        : direction === "up"
          ? "animate-in fade-in slide-in-from-bottom-6 duration-250"
          : "animate-in fade-in slide-in-from-top-6 duration-200";

  return (
    <Card className="w-full overflow-hidden shadow-sm">
      <div key={step} className={animationClass}>
        {step === "methods" && (
          <LoginMethodsStep
            onSelectEmail={handleSelectEmail}
            onSelectSocial={handleSocialLogin}
            onSelectPasskey={handlePasskeyLogin}
            loadingProvider={loadingProvider}
          />
        )}

        {step === "email" && (
          <LoginEmailStep
            email={email}
            onEmailChange={(val) => {
              setEmail(val);
              if (emailError) setEmailError(null);
            }}
            onSubmit={handleEmailSubmit}
            onBack={handleBackToMethods}
            isSending={isSendingOtp}
            error={emailError}
          />
        )}

        {step === "otp" && (
          <LoginOtpStep
            email={email}
            otp={otp}
            onOtpChange={(val) => {
              setOtp(val);
              if (otpError) setOtpError(null);
            }}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onBack={handleBackToEmail}
            isVerifying={isVerifyingOtp}
            isResending={isSendingOtp}
            countdown={countdown}
            error={otpError}
          />
        )}
      </div>
    </Card>
  );
}
