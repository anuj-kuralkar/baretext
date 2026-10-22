"use client";

import {
  addTransitionType,
  createContext,
  startTransition,
  useContext,
  useState,
} from "react";
import type { Step } from "./types";

interface LoginFormContextValue {
  step: Step;
  email: string;
  setEmail: (email: string) => void;
  goToMethods: () => void;
  goToEmail: () => void;
  goToOtp: (email?: string) => void;
}

const LoginFormContext = createContext<LoginFormContextValue | null>(null);

export function useLoginForm() {
  const context = useContext(LoginFormContext);
  if (!context) {
    throw new Error("useLoginForm must be used within a LoginFormProvider");
  }
  return context;
}

export function LoginFormProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>("methods");
  const [email, setEmail] = useState("");

  const goToMethods = () => {
    startTransition(() => {
      addTransitionType("back");
      setStep("methods");
    });
  };

  const goToEmail = () => {
    const type = step === "otp" ? "back" : "forward";
    startTransition(() => {
      addTransitionType(type);
      setStep("email");
    });
  };

  const goToOtp = (nextEmail?: string) => {
    startTransition(() => {
      addTransitionType("forward");
      if (nextEmail) setEmail(nextEmail);
      setStep("otp");
    });
  };

  return (
    <LoginFormContext.Provider
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
    </LoginFormContext.Provider>
  );
}
