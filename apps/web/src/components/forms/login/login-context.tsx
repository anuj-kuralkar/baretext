"use client";

import { createContext, startTransition, useContext, useState } from "react";
import type { Step } from "./types";

interface LoginContextValue {
  step: Step;
  email: string;
  setEmail: (email: string) => void;
  goToMethods: () => void;
  goToEmail: () => void;
  goToOtp: (email?: string) => void;
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
  const [email, setEmail] = useState("");

  const goToMethods = () => {
    startTransition(() => {
      setStep("methods");
    });
  };

  const goToEmail = () => {
    startTransition(() => {
      setStep("email");
    });
  };

  const goToOtp = (nextEmail?: string) => {
    startTransition(() => {
      if (nextEmail) setEmail(nextEmail);
      setStep("otp");
    });
  };

  return (
    <LoginContext.Provider
      value={{
        step,
        email,
        setEmail,
        goToMethods,
        goToEmail,
        goToOtp,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
