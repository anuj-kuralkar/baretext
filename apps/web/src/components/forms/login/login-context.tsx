"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";
import type { SlideDirection, SocialProvider, Step } from "./types";

const emailSchema = z.email("Please enter a valid email address");

interface LoginContextValue {
  step: Step;
  direction: SlideDirection;
  email: string;
  emailError: string | null;
  otp: string;
  otpError: string | null;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  loadingProvider: SocialProvider | "passkey" | null;
  countdown: number;

  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;

  goToMethods: () => void;
  goToEmail: () => void;
  goToOtp: () => void;

  loginWithSocial: (provider: SocialProvider) => Promise<void>;
  loginWithPasskey: () => Promise<void>;
  submitEmail: () => Promise<boolean>;
  verifyOtp: (code?: string) => Promise<void>;
  resendOtp: () => Promise<void>;
}

const LoginContext = createContext<LoginContextValue | null>(null);

export function useLogin() {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
}

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>("methods");
  const [direction, setDirection] = useState<SlideDirection>("left");

  // Providers loading state
  const [loadingProvider, setLoadingProvider] = useState<
    SocialProvider | "passkey" | null
  >(null);

  // Email state
  const [email, setEmailState] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // OTP state
  const [otp, setOtpState] = useState("");
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

  const setEmail = (val: string) => {
    setEmailState(val);
    if (emailError) setEmailError(null);
  };

  const setOtp = (val: string) => {
    setOtpState(val);
    if (otpError) setOtpError(null);
  };

  const goToMethods = () => {
    setDirection("right");
    setStep("methods");
    setEmailError(null);
  };

  const goToEmail = () => {
    setDirection(step === "otp" ? "down" : "left");
    setStep("email");
    setOtpState("");
    setOtpError(null);
  };

  const goToOtp = () => {
    setDirection("up");
    setStep("otp");
  };

  const loginWithPasskey = async () => {
    setLoadingProvider("passkey");
    const { error } = await authClient.signIn.passkey();
    setLoadingProvider(null);

    if (error) {
      toast.add({
        type: "error",
        title:
          error.message ?? error.statusText ?? "Passkey authentication failed",
      });
      return;
    }

    window.location.href = "/";
  };

  const loginWithSocial = async (provider: SocialProvider) => {
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
        title:
          error.message ??
          error.statusText ??
          `Failed to sign in with ${provider}`,
      });
    }
  };

  const submitEmail = async () => {
    const parseResult = emailSchema.safeParse(email.trim());
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      setEmailError(issue?.message ?? "Please enter a valid email address");
      return false;
    }

    setEmailError(null);
    setIsSendingOtp(true);

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: parseResult.data,
      type: "sign-in",
    });

    setIsSendingOtp(false);

    if (error) {
      setEmailError(
        error.message ?? error.statusText ?? "Failed to send verification code",
      );
      return false;
    }

    setCountdown(30);
    goToOtp();
    return true;
  };

  const verifyOtp = async (codeOverride?: string) => {
    const codeToVerify = (codeOverride ?? otp).trim();
    if (codeToVerify.length !== 6 || isVerifyingOtp) return;

    setIsVerifyingOtp(true);
    setOtpError(null);

    const { error } = await authClient.signIn.emailOtp({
      email: email.trim(),
      otp: codeToVerify,
    });

    setIsVerifyingOtp(false);

    if (error) {
      setOtpError(error.message ?? "Invalid or expired verification code");
      return;
    }

    window.location.href = "/";
  };

  const resendOtp = async () => {
    if (countdown > 0 || isSendingOtp) return;
    setOtpState("");
    setOtpError(null);
    setIsSendingOtp(true);

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: email.trim(),
      type: "sign-in",
    });

    setIsSendingOtp(false);

    if (error) {
      setOtpError(error.message ?? error.statusText ?? "Failed to resend code");
      return;
    }

    setCountdown(30);
  };

  return (
    <LoginContext.Provider
      value={{
        step,
        direction,
        email,
        emailError,
        otp,
        otpError,
        isSendingOtp,
        isVerifyingOtp,
        loadingProvider,
        countdown,
        setEmail,
        setOtp,
        goToMethods,
        goToEmail,
        goToOtp,
        loginWithSocial,
        loginWithPasskey,
        submitEmail,
        verifyOtp,
        resendOtp,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
